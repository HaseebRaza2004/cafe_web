import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

// PUT: Update Order Status (Admin Side)
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // Next.js 16.1 syntax (await params)
    const { status } = await req.json();
    await dbConnect();

    // Valid Statuses Check
    const validStatuses = ["Pending", "Cooking", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid Status" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Order marked as ${status}`,
        data: updatedOrder,
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

// GET: Single Order Details (Optional - Agar future mein Invoice print karni ho)
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 3. DELETE: Delete Order (Rarely used, but good for cleanup)
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    await Order.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Order Deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
