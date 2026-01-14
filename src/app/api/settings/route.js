import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

// GET: Fetch Settings (Shop Open/Close, Delivery Fee)
export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne().lean();

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json(
      { success: true, data: settings },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update Settings (Admin Toggle)
export async function PUT(req) {
  try {
    const body = await req.json();
    await dbConnect();

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json(
      {
        success: true,
        message: "Settings Updated!",
        data: updatedSettings,
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
