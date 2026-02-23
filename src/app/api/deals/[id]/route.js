import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import "@/models/Category";
import "@/models/Product";

// GET Single Deal
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deal = await Deal.findById(id)
      .populate({
        path: "itemGroups.specificProducts.product",
        model: "Product",
        select: "title image isAvailable",
      })
      .lean();

    if (!deal) {
      return NextResponse.json(
        { success: false, message: "Deal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deal }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Update Deal
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedDeal = await Deal.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedDeal) {
      return NextResponse.json(
        { success: false, message: "Deal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: updatedDeal },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE Deal
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedDeal = await Deal.findByIdAndDelete(id).lean();

    if (!deletedDeal) {
      return NextResponse.json(
        { success: false, message: "Deal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Deal Deleted" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
