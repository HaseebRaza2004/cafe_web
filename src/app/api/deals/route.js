import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import "@/models/Category";
import "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    const deals = await Deal.find({})
      .populate({
        path: "itemGroups.specificProducts.product",
        model: "Product",
        select: "title image isAvailable",
      })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: deals }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const deal = await Deal.create(body);

    return NextResponse.json({ success: true, data: deal }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
