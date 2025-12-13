'use server';
import { connectToDB } from "@/database";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server"; 
import { ObjectId } from "mongodb";
import FlashcardModel from "@/modals/flashcard.modal";

/**
 * Get all todos
 * @returns 
 */
export async function getFlashcards() {
    try {
        const db = await connectToDB();
        const { userId } = await auth();
        const flashcards = await FlashcardModel.find({ clerkId: userId }).lean();

        const cleanFlashcards = flashcards.map(flashcard => ({
            ...flashcard,
            _id: flashcard._id.toString(),
        }));
        
        return cleanFlashcards;
    } catch (e) {
        console.log(e);
    }
}

export async function getRecentFlashcard(){
    try {
        const db = await connectToDB();
        const { userId } = await auth();
        const mostRecentQuiz = await FlashcardModel.findOne({ clerkId: userId }).sort({ createdAt: -1 }).lean();
        return mostRecentQuiz;
    } catch (e) {
        console.log(e);
    }
}

export async function createFlashcard(flashcardData) {
    const { userId } = await auth();
  
    await FlashcardModel.create({
      clerkId: userId,
      flashcardTitle: flashcardData.questions[0]?.flashcardTitle || "Untitled Flashcard Set",
      questions: flashcardData.questions[0]?.questions,
      answers: flashcardData.questions[0]?.answers,
      quizType: flashcardData.questions[0]?.quizType || "Untitled Option",
    });
  
    revalidatePath("/");
}
  
export async function deleteFlashcard(id){
    await FlashcardModel.findOneAndDelete({_id: ObjectId.createFromHexString(id)})
    revalidatePath("/");
}

export async function updateFlashcard(id, newText){
    await FlashcardModel.findByIdAndUpdate({_id: ObjectId.createFromHexString(id)}, {$set: {flashcardTitle: newText}})
    revalidatePath("/");
}