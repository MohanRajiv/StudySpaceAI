'use server';
import { connectToDB } from "@/database";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import QuizModel from "@/modals/quiz.modal";
import { auth } from "@clerk/nextjs/server"; 
import { ObjectId } from "mongodb";

/**
 * Get all todos
 * @returns 
 */
export async function getQuizzes() {
    try {
        const db = await connectToDB();
        const { userId } = await auth();
        const quizzes = await QuizModel.find({ clerkId: userId }).lean();

        const cleanQuizzes = quizzes.map(quiz => ({
            ...quiz,
            _id: quiz._id.toString(),
        }));
        
        return cleanQuizzes;
    } catch (e) {
        console.log(e);
    }
}

export async function getRecentQuiz(){
    try {
        const db = await connectToDB();
        const { userId } = await auth();
        const mostRecentQuiz = await QuizModel.findOne({ clerkId: userId }).sort({ createdAt: -1 }).lean();
        return mostRecentQuiz;
    } catch (e) {
        console.log(e);
    }
}

export async function createQuiz(quizData) {
    const { userId } = await auth();
  
    const formattedQuestions = quizData.questions.map((q) => ({
      question: q.question,
      options: q.options,
      explanation: q.explanation,
      answerIndexes: q.correctAnswer,
      questionType: q.questionType,
    }));
  
    await QuizModel.create({
      clerkId: userId,
      quizTitle: quizData.questions[0]?.quizTitle || "Untitled Quiz",
      questions: formattedQuestions,
      quizType: quizData.questions[0]?.quizType || "Untitled Option",
      timerSeconds: quizData.timerSeconds,
    });
  
    revalidatePath("/");
}
  
export async function deleteQuiz(id){
    await QuizModel.findOneAndDelete({_id: ObjectId.createFromHexString(id)})
    revalidatePath("/");
}

export async function updateQuiz(id, newText){
    await QuizModel.findByIdAndUpdate({_id: ObjectId.createFromHexString(id)}, {$set: {quizTitle: newText}})
    revalidatePath("/");
}