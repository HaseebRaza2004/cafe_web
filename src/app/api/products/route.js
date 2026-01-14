import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
// Models register karne zaroori hain taake populate work kare
import "@/models/OptionGroup";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Optimized Query Builder
    let query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 🔥 SUPER FAST FETCHING LOGIC
    const products = await Product.find(query)
      .populate({
        path: "productOptions.optionGroupId", // Option Group ka data lao
        select: "name type options", // Sirf zaroori fields
        populate: {
          path: "options.linkedProduct", // Agar Coke link hai to uska data bhi lao
          select: "title isAvailable image", // Taake hum "Not Available" tag dikha sakein
        },
      })
      .sort({ createdAt: -1 })
      .lean(); // JSON conversion for speed

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

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();

    // Advanced Validation handled by Mongoose Schema
    const newProduct = await Product.create({
      title: body.title,
      desc: body.desc,
      category: body.category,
      image: body.image,
      price: Number(body.price),
      discountPrice: Number(body.discountPrice || 0),
      isAvailable: body.isAvailable ?? true,

      // New Logic Fields
      variations: body.variations || [], // Sizes Array
      productOptions: body.productOptions || [], // Linked Groups + Filters
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product Created Successfully! 🚀",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
