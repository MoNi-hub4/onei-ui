import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-")
    .replace(/[^\w-]+/g, "");
}

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create({
      ...body,
      slug: body.slug || createSlug(body.name),
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}