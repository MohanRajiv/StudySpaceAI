import { NextResponse } from "next/server";
import { getRecentFlashcard } from "@/actions/flashcard.action";

export async function GET() {
  try {
    const recentFlashcard = await getRecentFlashcard(); 
    if (!recentFlashcard) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }

    return NextResponse.json(recentFlashcard);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}