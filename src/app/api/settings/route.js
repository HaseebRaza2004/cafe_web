import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

function isShopOpen(openTime, closeTime) {
  if (!openTime || !closeTime) return false;

  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
  const currentDate = new Date(now);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  // Logic:
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }
}

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne().lean();
    if (!settings) settings = await Settings.create({});
    const isOpenByTime = isShopOpen(settings.openingTime, settings.closingTime);

    const finalShopStatus = isOpenByTime && !settings.isForceClosed;

    return NextResponse.json(
      {
        success: true,
        data: {
          ...settings,
          isOpen: finalShopStatus,
          isOpenByTime: isOpenByTime,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    await dbConnect();

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Settings Updated", data: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
