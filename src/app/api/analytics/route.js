import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// Force API route to be dynamic (no caching)
export const dynamic = "force-dynamic";

// Week Padding (Mon - Sun)
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

// Month Padding (1 - 30/31)
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

// Year Padding (Jan - Dec)
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

// Status Padding
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

  // Return only statuses with values > 0 to keep chart clean, or all if you prefer
  return defaultStatuses;
};

// --- API ROUTE ---

export async function GET() {
  try {
    await dbConnect();

    // CALCULATE TIME RANGES FOR QUERIES
    const now = new Date();

    // Start of Today
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Start of This Week (Monday)
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of This Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    // Start of This Year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // FETCHING ALL DATA IN PARALLEL
    const [
      kpiData,
      totalProducts,
      pendingOrdersCount,

      // Revenue Groupings
      revWeek,
      revMonth,
      revYear,

      // Status Groupings
      statusToday,
      statusWeek,
      statusMonth,

      // Top Sellers
      topSellersToday,
      topSellersWeek,
      topSellersMonth,
    ] = await Promise.all([
      // KPIs (Total Orders & Overall Revenue)
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

      // --- REVENUE TRENDS ---
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

      // --- ORDER STATUSES ---
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

      // --- TOP SELLERS ---
      // Top Sellers Today
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            status: { $ne: "Cancelled" },
          },
        },
        { $unwind: "$cartItems" },
        {
          $group: {
            _id: "$cartItems.productId",
            name: { $first: "$cartItems.name" },
            category: { $first: "Item" },
            sales: { $sum: "$cartItems.quantity" },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
      ]),
      // Top Sellers This Week
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfWeek },
            status: { $ne: "Cancelled" },
          },
        },
        { $unwind: "$cartItems" },
        {
          $group: {
            _id: "$cartItems.productId",
            name: { $first: "$cartItems.name" },
            category: { $first: "Item" },
            sales: { $sum: "$cartItems.quantity" },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
      ]),
      // Top Sellers This Month
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            status: { $ne: "Cancelled" },
          },
        },
        { $unwind: "$cartItems" },
        {
          $group: {
            _id: "$cartItems.productId",
            name: { $first: "$cartItems.name" },
            category: { $first: "Item" },
            sales: { $sum: "$cartItems.quantity" },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // FORMATTING THE FINAL PAYLOAD
    const totalRevenue = kpiData.length > 0 ? kpiData[0].totalRevenue : 0;
    const totalOrders = kpiData.length > 0 ? kpiData[0].totalOrders : 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          // KPI Stats
          totalOrders,
          totalProducts,
          totalRevenue,
          pendingOrders: pendingOrdersCount,

          // Chart Data
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
            Today: topSellersToday,
            "This Week": topSellersWeek,
            "This Month": topSellersMonth,
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
};