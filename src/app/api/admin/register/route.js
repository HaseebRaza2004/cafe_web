import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingAdmin = await Admin.findOne({ email }).lean();
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists!" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Admin Registered Successfully!",
        adminId: newAdmin._id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};