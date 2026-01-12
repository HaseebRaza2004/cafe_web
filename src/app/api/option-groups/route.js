import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import OptionGroup from "@/models/OptionGroup";

// GET: Fetch All Option Groups
export async function GET() {
  try {
    await dbConnect();

    const optionGroups = await OptionGroup.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ 
      success: true, 
      data: optionGroups 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create New Option Group (Admin Only)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, type, isRequired, options } = body;

    if (!name) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json({ error: "At least one option is required" }, { status: 400 });
    }

    await dbConnect();

    const newGroup = await OptionGroup.create({
      name,
      type: type || "single",
      isRequired: isRequired || false,
      options // Array of objects [{ name: "Coke", price: 50 }]
    });

    return NextResponse.json({ 
      success: true, 
      message: "Option Group Created!",
      data: newGroup 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}