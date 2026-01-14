import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

// POST: Create New Order (User Side)
export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();

    // Fast Validation
    if (!body.cartItems || body.cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }
    if (!body.customerName || !body.phone || !body.address) {
      return NextResponse.json(
        { success: false, error: "Missing details" },
        { status: 400 }
      );
    }

    // Creating Order
    const newOrder = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      instruction: body.instruction || "",
      cartItems: body.cartItems,
      totalAmount: Number(body.totalAmount),
      status: "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order Placed Successfully!",
        orderId: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch All Orders (Admin Side)
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, count: orders.length, data: orders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
