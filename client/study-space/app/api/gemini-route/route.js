import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, numOfQuestions, quizType } = await req.json(); 

    if (!text || !numOfQuestions) {
      return NextResponse.json({ error: "No text or number input provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert quiz generator. Based on the following text content, 
    generate the specified number of quiz questions based on the number provided and the quiz type provided. Multiple Choice should have 
    4 options with one correct answer. Mixed Format should combine both multiple choice and True/False as shown below. Include brief 
    explanations for each answer. IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no code blocks, no additional text).
    Multiple Choice:
    {
    "questions": [
        {
        "quizTitle": "Quiz Title here",
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": [0],
        "explanation": "Brief explanation of why this answer is correct"
        }
    ]
    }
    True or False:
    {
      "questions": [
          {
          "quizTitle": "Quiz Title here",
          "question": "Question text here?",
          "options": ["True", "False"],
          "correctAnswer": [0],
          "explanation": "Brief explanation of why this answer is correct"
          }
      ]
    }
    Mixed Format:
    {
      "questions": [
          {
          "quizTitle": "Quiz Title here",
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": [0],
          "explanation": "Brief explanation of why this answer is correct"
          }
          {
            "quizTitle": "Quiz Title here",
            "question": "Question text here?",
            "options": ["True", "False"],
            "correctAnswer": [0],
            "explanation": "Brief explanation of why this answer is correct"
          }
      ]
    }
    Text to analyze:
    ${text}
    Number of Questions:
    ${numOfQuestions}
    Quiz Type:
    ${quizType}
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
