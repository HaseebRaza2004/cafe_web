import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    const updatedDeal = await Deal.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json({ success: true, data: updatedDeal });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    await Deal.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Deal Deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
