import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import OptionGroup from "@/models/OptionGroup";

export async function GET() {
  try {
    await dbConnect();
    const groups = await OptionGroup.find({})
      .populate("options.linkedProduct", "title isAvailable image") // Link check karne ke liye
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: groups }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name || !body.options) {
      return NextResponse.json(
        { error: "Name and Options are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newGroup = await OptionGroup.create({
      name: body.name,
      type: body.type || "single",
      options: body.options,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Option Group Saved! ✅",
        data: newGroup,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
