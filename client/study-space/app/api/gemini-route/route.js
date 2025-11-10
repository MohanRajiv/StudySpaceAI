import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, numOfQuestions } = await req.json(); 

    if (!text || !numOfQuestions) {
      return NextResponse.json({ error: "No text or number input provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert quiz generator. Based on the following text content, 
    generate the specified number of multiple-choice quiz questions based on the number provided. Each question should have 
    4 options with one correct answer. Include brief explanations for each answer.
    IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no code blocks, 
    no additional text):
    {
    "questions": [
        {
        "quizTitle": "Quiz Title here",
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Brief explanation of why this answer is correct"
        }
    ]
    }
    Text to analyze:
    ${text}
    Number of Questions:
    ${numOfQuestions}
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
