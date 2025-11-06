import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database";
import Quiz from "@/modals/quiz.modal";

export async function GET(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();
    
    // Fetch all quizzes for the current user, sorted by creation date (newest first)
    const quizzes = await Quiz.find({ clerkId: userId })
      .sort({ createdAt: -1 })
      .select("-extractedText") // Exclude extractedText to reduce payload size
      .lean();

    // Transform quizzes for frontend
    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz._id.toString(),
      sourceType: quiz.sourceType,
      pdfFileName: quiz.pdfFileName,
      status: quiz.status,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questionsCount: quiz.quizData?.questions?.length || 0,
      hasQuizData: !!quiz.quizData,
    }));

    return NextResponse.json({
      success: true,
      quizzes: formattedQuizzes,
    });

  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch quizzes",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

