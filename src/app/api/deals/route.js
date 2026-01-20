import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import "@/models/Category"; 
import "@/models/Product";

// Fetch All Deals 
export async function GET() {
  await dbConnect();
  const deals = await Deal.find({})
    .populate("itemGroups.category")
    .populate("itemGroups.specificProducts")
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, data: deals });
}

// Create New Deal
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const deal = await Deal.create(body);
    return NextResponse.json({ success: true, data: deal });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
