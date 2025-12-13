import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {text, numOfQuestions, quizType, questionTypes} = await req.json(); 

    if (!text || !numOfQuestions) {
      return NextResponse.json({ error: "No text or video input provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert quiz and flashcard generator. You MUST return valid JSON only.
    No notes, no markdown, no explanations outside the JSON.
    
    ====================================
    REQUIREMENTS
    ====================================
    
    1. If the user selected multiple question types, questionTypes and numOfQuestions are 
    parallel arrays if they have the same number of elements.
      Example:
        questionTypes = ["MCQ", "TF", "MA"]
        numOfQuestions = [3, 5, 2]
      This means:
        • Generate 3 MCQ
        • Generate 5 True/False
        • Generate 2 Multiple Answer

    2. You MUST generate the exact number of questions per type:
        ${JSON.stringify(questionTypes)}  
        ${JSON.stringify(numOfQuestions)}

    3. If the user selected multiple question types and numOfQuestions has 
    only one element.
      Example:
        questionTypes = ["MCQ", "TF", "MA"]
        numOfQuestions = [5]
      This means:
        • Generate 5 questions and the number of MCQ, True/False, and
          Multiple Answer questions is random.

    4. Items MUST match the provided quizType.

    5. Distribute questions randomly if multiple question types are selected.

    ====================================
    QUIZ FORMAT (USED WHEN quizType="Quiz")
    ====================================
    Return this EXACT JSON shape:

    {
      "questions": [
       {
        "quizTitle": "Quiz Title Here",
        "quizType": "Quiz",
        "question": "Question text?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": [0],
        "explanation": "Reason",
        "questionType": "Multiple Choice | True or False | Multiple Answer | Dropdown"
        }
      ]
    }

    Rules:
    • Multiple Choice: ALWAYS 4 options, 1 correct answer.
    • True or False: options MUST be ["True","False"].
    • Multiple Answer: 4 options, multiple correct indices.
    • Dropdown: 3-4 options, 1 correct answer.

    ====================================
    FLASHCARD FORMAT (quizType="Flashcard")
    ====================================

    1. If the user selected multiple question types, questionTypes and numOfQuestions are 
    parallel arrays if they have the same number of elements.
      Example:
        questionTypes = ["Definitions", "Questions"]
        numOfQuestions = [3, 5]
      This means:
        • Generate 3 Definition Flashcards
        • Generate 5 Question Flashcards

    2. You MUST generate the exact number of Flashcards per type:
        ${JSON.stringify(questionTypes)}  
        ${JSON.stringify(numOfQuestions)}

    3. If the user selected multiple question types and numOfQuestions has 
    only one element.
      Example:
        questionTypes = ["Definitions", "Questions"]
        numOfQuestions = [5]
      This means:
        • Generate 5 Flashcards and the number of Definition Flashcards and
          Question Flashcards is random.

    4. Distribute flashcards randomly if multiple question types are selected.

    Return this JSON:
    {
      "questions": [
          {
          "flashcardTitle": "Quiz Title here",
          "quizType": "${quizType}",
          "questions": ["Question or Definition here", "Question or Definition here", ...],
          "answers": ["Answer", "Answer", ...],
          }
      ]
    }

    Rules:
    • Questions and answers must both be arrays of length ${JSON.stringify(numOfQuestions)}

    Text to analyze:
    ${text}
    Number of Questions:
    ${JSON.stringify(numOfQuestions)}
    Quiz Type:
    ${quizType}
    Question Types (array):
    ${JSON.stringify(questionTypes)}
    `;

    const result = await model.generateContent(prompt);
    const output = result.response.text(); 

    return NextResponse.json({ text: output }); 
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
