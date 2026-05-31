import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-")
    .replace(/[^\w-]+/g, "");
}

function cleanText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20000);
}

function extractJson(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function POST(req) {
  try {
    const { productName, officialUrl } = await req.json();

    if (!productName || !officialUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name and official/product URL are required",
        },
        { status: 400 }
      );
    }

    const pageRes = await fetch(officialUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 OneiCMSBot/1.0",
      },
    });

    if (!pageRes.ok) {
      throw new Error("Failed to read official/product URL");
    }

    const html = await pageRes.text();
    const pageText = cleanText(html);

    const prompt = `
You are an ecommerce CMS product data assistant.

Generate ONLY text-based product data for this product.

Product name:
${productName}

Official/product page text:
${pageText}

Return ONLY valid JSON with this exact structure:

{
  "name": "",
  "slug": "",
  "price": "",
  "category": "",
  "productType": "",
  "productSubType": "",
  "brand": "",
  "sku": "",
  "stockStatus": "in-stock",
  "description": "",
  "specifications": [
    {
      "label": "",
      "value": ""
    }
  ],
  "warranty": "",
  "isActive": true
}

Rules:
- Do not include image, variants, gallery, colors, or media fields.
- Do not invent exact price unless it is clearly available.
- If price is not found, use an empty string.
- category must be one of: Apple, Android, Gaming, Sounds, Dyson, Wearables, Accessories, Cameras, Smart Home.
- productType examples: iPhone, iPad, MacBook, Apple Watch, Earbuds, Headphones, Speaker, Console, Camera.
- productSubType is optional. Use empty string if not clear.
- stockStatus must be one of: in-stock, out-of-stock, pre-order, coming-soon.
- specifications must be useful simple label/value pairs.
- warranty can be empty if not found.
- Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    const jsonText = extractJson(response.text);
    const aiProduct = JSON.parse(jsonText);

    return NextResponse.json({
      success: true,
      product: {
        ...aiProduct,
        slug: aiProduct.slug || createSlug(productName),
      },
    });
  } catch (error) {
    console.error("GEMINI PRODUCT GENERATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}