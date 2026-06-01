import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const revalidate = 300;

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: { $ne: false },
    })
      .select("name slug price image variants category productType isActive")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        products: JSON.parse(JSON.stringify(products)),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        products: [],
      },
      { status: 500 }
    );
  }
}