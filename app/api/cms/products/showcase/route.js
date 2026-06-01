import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: { $ne: false },
    })
      .select(
        "name slug price image variants category productType brand stockStatus isActive createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        products: JSON.parse(JSON.stringify(products)),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Showcase products API failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to load showcase products",
        products: [],
      },
      { status: 500 }
    );
  }
}