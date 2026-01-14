import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import OptionGroup from "@/models/OptionGroup";
import "@/models/Product";

// GET Single Option Group
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const optionGroup = await OptionGroup.findById(id)
      .populate("options.linkedProduct", "title isAvailable image")
      .lean();

    if (!optionGroup) {
      return NextResponse.json(
        { success: false, error: "Option Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: optionGroup },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT Update Option Group
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Group Name is required" },
        { status: 400 }
      );
    }

    const updatedGroup = await OptionGroup.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          type: body.type || "single",
          options: body.options,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedGroup) {
      return NextResponse.json(
        { success: false, error: "Option Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Option Group Updated Successfully!",
        data: updatedGroup,
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

// DELETE Option Group
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedGroup = await OptionGroup.findByIdAndDelete(id);

    if (!deletedGroup) {
      return NextResponse.json(
        { success: false, error: "Option Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Option Group Deleted! 🗑️",
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
