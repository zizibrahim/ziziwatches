import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { message, locale, history, productContext } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const response = await getChatResponse({ message, locale, history, productContext });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    const isApiKeyError =
      error instanceof Error && error.message.includes("GEMINI_API_KEY");
    return NextResponse.json(
      {
        error: isApiKeyError
          ? "AI not configured. Add your GEMINI_API_KEY to .env.local"
          : "AI service unavailable",
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
