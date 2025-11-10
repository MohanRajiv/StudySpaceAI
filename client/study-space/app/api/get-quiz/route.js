import { NextResponse } from "next/server";
import QuizModel from "@/modals/quiz.modal";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const quiz = await QuizModel.findById(id).lean(); 
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
