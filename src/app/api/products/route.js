import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
// OptionGroup import karna zaroori hai taake populate kaam kare
import OptionGroup from "@/models/OptionGroup";

// 1. GET: Products Fetch karna (With Filtering & Population)
export async function GET(request) {
  try {
    await dbConnect();

    // URL se category nikalo (e.g. /api/products?category=pizza)
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Query Build karo (Agar category hai to filter karo, warna sab lay ao)
    const query = category
      ? { category: { $regex: category, $options: "i" } }
      : {};

    const products = await Product.find(query)
      .populate("allowedOptions")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Product Create karna
export async function POST(req) {
  try {
    const body = await req.json();

    // Basic Validation
    if (!body.title || !body.price || !body.category || !body.image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newProduct = await Product.create({
      title: body.title,
      desc: body.desc,
      price: body.price,
      discountPrice: body.discountPrice || 0,
      category: body.category,
      image: body.image,
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
      allowedOptions: body.allowedOptions || [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product Created Successfully! 🍔",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
