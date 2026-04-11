import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// API ROUTE CONFIG
export const dynamic = "force-dynamic";

// --- DATA PADDING FUNCTIONS ---
const padWeekData = (dbData) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mapMongoDayToStandard = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 1: 6 };
  const padded = days.map((day) => ({ name: day, revenue: 0 }));

  dbData.forEach((item) => {
    const standardIndex = mapMongoDayToStandard[item._id];
    if (standardIndex !== undefined) {
      padded[standardIndex].revenue = item.total;
    }
  });
  return padded;
};

const padMonthData = (dbData, daysInMonth) => {
  const padded = Array.from({ length: daysInMonth }, (_, i) => ({
    name: `${i + 1}`,
    revenue: 0,
  }));
  dbData.forEach((item) => {
    padded[item._id - 1].revenue = item.total;
  });
  return padded;
};

const padYearData = (dbData) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const padded = months.map((month) => ({ name: month, revenue: 0 }));
  dbData.forEach((item) => {
    padded[item._id - 1].revenue = item.total;
  });
  return padded;
};

const padStatusData = (dbData) => {
  const defaultStatuses = [
    { name: "Delivered", value: 0, color: "#22c55e" },
    { name: "Cooking", value: 0, color: "#eab308" },
    { name: "Pending", value: 0, color: "#C5A059" },
    { name: "Cancelled", value: 0, color: "#ef4444" },
  ];

  dbData.forEach((item) => {
    const statusObj = defaultStatuses.find((s) => s.name === item._id);
    if (statusObj) statusObj.value = item.count;
  });
  return defaultStatuses;
};

// --- TREND GENERATOR ---
const addTrend = (data) =>
  data.map((item) => {
    const trendVal = Math.floor((item.sales / (item.sales + 10)) * 15) + 5;
    return { ...item, trend: `+${trendVal}%` };
  });

// --- API ROUTE ---
export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const getTopSellersPipeline = (startDate) => [
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "Cancelled" },
        },
      },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.productId",
          sales: { $sum: "$cartItems.quantity" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      {
        $addFields: {
          parsedObjId: {
            $convert: {
              input: "$_id",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "parsedObjId",
          foreignField: "_id",
          as: "productDoc",
        },
      },
      {
        $lookup: {
          from: "deals",
          localField: "parsedObjId",
          foreignField: "_id",
          as: "dealDoc",
        },
      },
      {
        $addFields: {
          productItem: { $arrayElemAt: ["$productDoc", 0] },
          dealItem: { $arrayElemAt: ["$dealDoc", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          sales: 1,
          name: {
            $ifNull: ["$productItem.title", "$dealItem.title", "Deleted Item"],
          },
          category: {
            $ifNull: [
              "$productItem.category",
              {
                $cond: [
                  { $ifNull: ["$dealItem._id", false] },
                  "Exclusive Deal",
                  "Uncategorized",
                ],
              },
            ],
          },
        },
      },
    ];

    // FETCHING ALL DATA IN PARALLEL (Promises)
    const [
      kpiData,
      totalProducts,
      pendingOrdersCount,
      revWeek,
      revMonth,
      revYear,
      statusToday,
      statusWeek,
      statusMonth,
      topSellersToday,
      topSellersWeek,
      topSellersMonth,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      Product.countDocuments(),
      Order.countDocuments({ status: "Pending" }),

      // Revenue Groupings
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfWeek },
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear },
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      // Status Groupings
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Top Sellers Queries
      Order.aggregate(getTopSellersPipeline(startOfToday)),
      Order.aggregate(getTopSellersPipeline(startOfWeek)),
      Order.aggregate(getTopSellersPipeline(startOfMonth)),
    ]);

    const totalRevenue = kpiData.length > 0 ? kpiData[0].totalRevenue : 0;
    const totalOrders = kpiData.length > 0 ? kpiData[0].totalOrders : 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          totalOrders,
          totalProducts,
          totalRevenue,
          pendingOrders: pendingOrdersCount,
          revenue: {
            "This Week": padWeekData(revWeek),
            "This Month": padMonthData(revMonth, daysInMonth),
            "This Year": padYearData(revYear),
          },
          orderStatus: {
            Today: padStatusData(statusToday),
            "This Week": padStatusData(statusWeek),
            "This Month": padStatusData(statusMonth),
          },
          topSellers: {
            Today: addTrend(topSellersToday),
            "This Week": addTrend(topSellersWeek),
            "This Month": addTrend(topSellersMonth),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics data",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
