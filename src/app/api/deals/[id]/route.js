import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import "@/models/Category"; // Register models
import "@/models/Product";

// 🔥 GET Single Deal (Fixed for Next.js 16)
export async function GET(req, { params }) {
  try {
    await dbConnect();

    // Fix: params ko await karna zaroori hai
    const { id } = await params;

    const deal = await Deal.findById(id)
      .populate("itemGroups.category")
      .populate({
        path: "itemGroups.specificProducts.product",
        model: "Product",
      })
      .lean();

    if (!deal) {
      return NextResponse.json(
        { success: false, message: "Deal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deal });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

// 🔥 PUT Update Deal (Fixed)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Fix here too
    const body = await req.json();

    const updatedDeal = await Deal.findByIdAndUpdate(id, body, { new: true });

    if (!updatedDeal) {
      return NextResponse.json(
        { success: false, message: "Deal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedDeal });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

// 🔥 DELETE Deal (Fixed)
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Fix here too

    await Deal.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Deal Deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
