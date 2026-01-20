import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const updated = await Category.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: "Deleted" });
}