import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database";
import Quiz from "@/modals/quiz.modal";

export async function GET(req, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();
    
    // Find the quiz and verify ownership
    const quiz = await Quiz.findOne({ _id: id, clerkId: userId }).lean();
    
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found or you don't have permission to view it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz._id.toString(),
        sourceType: quiz.sourceType,
        pdfFileName: quiz.pdfFileName,
        status: quiz.status,
        quizData: quiz.quizData,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      }
    });

  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch quiz",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();
    
    // Find the quiz and verify ownership
    const quiz = await Quiz.findOne({ _id: id, clerkId: userId });
    
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete the quiz
    await Quiz.deleteOne({ _id: id, clerkId: userId });

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete quiz",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

