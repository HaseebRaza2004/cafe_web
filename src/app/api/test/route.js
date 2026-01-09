import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json(
      { message: "Mongoose 9 & Next 16 Connected Successfully! 🚀" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Connection Failed: " + error.message },
      { status: 500 }
    );
  }
};