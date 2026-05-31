import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CmsAsset from "@/models/CmsAsset";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  await connectDB();

  const assets = await CmsAsset.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    assets,
  });
}

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const files = formData.getAll("files");

    const uploadedAssets = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "onei-cms/assets",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      const asset = await CmsAsset.create({
        name: file.name,
        url: result.secure_url,
        type: result.resource_type,
        publicId: result.public_id,
      });

      uploadedAssets.push(asset);
    }

    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully",
      assets: uploadedAssets,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}