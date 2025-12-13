import { NextResponse } from "next/server";
import { getRecentQuiz } from "@/actions/quiz.action";

export async function GET() {
  try {
    const recentQuiz = await getRecentQuiz(); 
    if (!recentQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(recentQuiz);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}