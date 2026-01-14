import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import "@/models/OptionGroup";

// GET Single Product (For Edit Page)
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const product = await Product.findById(id)
      .populate({
        path: "productOptions.optionGroupId",
        select: "name type options",
        populate: {
          path: "options.linkedProduct",
          select: "title isAvailable image",
        },
      })
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT Update Product (Edit logic incl. Variations & Deals)
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          title: body.title,
          desc: body.desc,
          price: Number(body.price),
          discountPrice: Number(body.discountPrice || 0),
          category: body.category,
          image: body.image,
          isAvailable: body.isAvailable,
          variations: body.variations,
          productOptions: body.productOptions,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product Updated Successfully!",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE Product
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product Deleted Successfully! 🗑️",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
