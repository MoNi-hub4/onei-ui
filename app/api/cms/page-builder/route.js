import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CmsPage from "@/models/CmsPage";

export async function GET() {
  await connectDB();

  let page = await CmsPage.findOne({
    pageKey: "home",
  }).lean();

  if (!page) {
    page = await CmsPage.create({
      pageKey: "home",
      widgets: [],
      status: "published",
    });
  }

  return NextResponse.json({
    success: true,
    widgets: page.widgets || [],
  });
}

export async function POST(request) {
  await connectDB();

  const body = await request.json();

  const page = await CmsPage.findOneAndUpdate(
    { pageKey: "home" },
    {
      pageKey: "home",
      widgets: body.widgets || [],
      status: "published",
    },
    {
      upsert: true,
      new: true,
    }
  );

  return NextResponse.json({
    success: true,
    widgets: page.widgets,
  });
}