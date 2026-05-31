import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function GET() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: "What is the iPhone 17e?",
  });

  return NextResponse.json({
    text: response.text,
  });
}
