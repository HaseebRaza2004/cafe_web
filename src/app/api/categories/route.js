import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

// Fetch All Categories
export async function GET() {
  await dbConnect();
  const categories = await Category.find({}).sort({ sortOrder: 1 }).lean();
  return NextResponse.json({ success: true, data: categories });
}

// Create New Category
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.sortOrder) {
      const lastCat = await Category.findOne().sort({ sortOrder: -1 });
      body.sortOrder = lastCat ? lastCat.sortOrder + 1 : 1;
    }

    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

// Update Sort Order
export async function PUT(req) {
  try {
    await dbConnect();
    const { categories } = await req.json();

    const bulkOps = categories.map((cat) => ({
      updateOne: {
        filter: { _id: cat._id },
        update: { $set: { sortOrder: cat.sortOrder } },
      },
    }));

    await Category.bulkWrite(bulkOps);
    return NextResponse.json({ success: true, message: "Order Updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
