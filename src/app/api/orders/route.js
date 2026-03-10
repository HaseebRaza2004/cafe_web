import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Settings from "@/models/Settings";

// Double-Lock Timing Validation Helper
function isShopOpen(openTime, closeTime) {
  if (!openTime || !closeTime) return false;

  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
  const currentDate = new Date(now);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const settings = await Settings.findOne().lean();
    if (settings) {
      const isOpenByTime = isShopOpen(
        settings.openingTime,
        settings.closingTime,
      );
      const finalShopStatus = isOpenByTime && !settings.isForceClosed;

      if (!finalShopStatus) {
        const errorMsg = settings.isForceClosed
          ? "Due to scheduled maintenance, our system is temporarily paused."
          : `We are currently closed. Our operating hours are from ${settings.openingTime} to ${settings.closingTime} PKT.`;

        return NextResponse.json(
          { success: false, error: errorMsg },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    // Fast Validations
    if (!body.cartItems || body.cartItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Your cart is empty. Please add items to proceed.",
        },
        { status: 400 },
      );
    }
    if (
      !body.customerName ||
      !body.phone ||
      !body.address ||
      !body.deliveryArea
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required delivery details. Please fill all fields.",
        },
        { status: 400 },
      );
    }

    // Attempt to Create Order
    const newOrder = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      altPhone: body.altPhone || "",
      email: body.email || "",
      address: body.address,
      landmark: body.landmark || "",
      deliveryArea: body.deliveryArea,
      instruction: body.instruction || "",
      changeRequest: body.changeRequest || "",
      cartItems: body.cartItems,
      subtotal: Number(body.subtotal),
      tax: Number(body.tax),
      deliveryFee: Number(body.deliveryFee),
      totalAmount: Number(body.totalAmount),
      status: "Pending",
      paymentMethod: "COD",
    });

    // TODO: Pusher Real-Time Notification Logic will go here in next step

    return NextResponse.json(
      {
        success: true,
        message: "Order Secured Successfully!",
        orderId: newOrder._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order Creation Error: ", error); 

    let errorMessage =
      "An unexpected error occurred while placing your order. Please try again.";

    if (error.name === "ValidationError") {
      errorMessage =
        "Invalid order data format. Please review your cart and details.";
    } else if (error.name === "CastError") {
      errorMessage =
        "System encountered a data format issue. Please clear your cart and try again.";
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load orders." },
      { status: 500 },
    );
  }
}
