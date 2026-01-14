import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// GET: Dashboard Stats
export async function GET() {
  try {
    await dbConnect();

    const [totalOrders, totalProducts, pendingOrders, revenueData] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments({ status: "Pending" }),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          totalOrders,
          totalProducts,
          totalRevenue,
          pendingOrders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
