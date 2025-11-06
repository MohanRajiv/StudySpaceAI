import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database";
import Quiz from "@/modals/quiz.modal";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file. Please upload a PDF file." },
        { status: 400 }
      );
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Please upload a PDF smaller than 10MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF using pdf2json
    let extractedText;
    try {
      // Use pdf2json - CommonJS library that works well in server environments
      const PDFParser = require("pdf2json");
      
      if (!PDFParser || typeof PDFParser !== 'function') {
        throw new Error("PDFParser not found");
      }
      
      // Create a promise-based wrapper for pdf2json
      extractedText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on("pdfParser_dataError", (errData) => {
          reject(new Error(errData.parserError || "Failed to parse PDF"));
        });
        
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          try {
            // Extract text from all pages
            let fullText = "";
            if (pdfData.Pages && pdfData.Pages.length > 0) {
              for (const page of pdfData.Pages) {
                if (page.Texts && page.Texts.length > 0) {
                  for (const textItem of page.Texts) {
                    if (textItem.R && textItem.R.length > 0) {
                      for (const run of textItem.R) {
                        if (run.T) {
                          // Decode URI component if needed
                          fullText += decodeURIComponent(run.T) + " ";
                        }
                      }
                    }
                  }
                }
              }
            }
            resolve(fullText.trim());
          } catch (err) {
            reject(err);
          }
        });
        
        // Parse the buffer
        pdfParser.parseBuffer(buffer);
      });
      
      if (!extractedText || extractedText.length === 0) {
        return NextResponse.json(
          { error: "Could not extract text from PDF. The PDF might be image-based or encrypted." },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("PDF parsing error:", error);
      return NextResponse.json(
        { 
          error: error.message || "Failed to parse PDF. Please ensure the PDF is valid and not corrupted.",
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    // Save to database first
    await connectToDB();
    
    const quiz = await Quiz.create({
      clerkId: userId,
      sourceType: "pdf",
      pdfFileName: file.name,
      extractedText: extractedText,
      status: "processing",
    });

    // Generate quiz questions using Google Gemini
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured. Please add your Google Gemini API key to the environment variables.");
      }

      // Dynamically import Google Generative AI to avoid issues if package is not available
      let GoogleGenerativeAI;
      try {
        GoogleGenerativeAI = (await import("@google/generative-ai")).GoogleGenerativeAI;
      } catch (importError) {
        throw new Error("Failed to load Google Generative AI library. Please ensure the '@google/generative-ai' package is installed.");
      }

      const apiKey = process.env.GEMINI_API_KEY.trim();
      
      // Validate API key format (Gemini API keys typically start with AIza)
      if (!apiKey || apiKey.length < 10) {
        throw new Error("Invalid GEMINI_API_KEY format. Please check your API key.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-pro which is the most stable and widely available model
      // Alternative: "gemini-1.5-pro-latest" for newer capabilities
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Truncate text if too long (Gemini has token limits)
      const maxTextLength = 30000; // Safe limit for Gemini Pro context window
      const textToAnalyze = extractedText.length > maxTextLength 
        ? extractedText.substring(0, maxTextLength) + "..."
        : extractedText;

      const prompt = `You are an expert quiz generator. Based on the following text content, generate 5-10 multiple-choice quiz questions. Each question should have 4 options with one correct answer. Include brief explanations for each answer.

IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no code blocks, no additional text):
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Text content:
${textToAnalyze}`;

      let result;
      let response;
      let responseText;
      
      try {
        result = await model.generateContent(prompt);
        response = await result.response;
        responseText = response.text();
      } catch (geminiError) {
        // Handle Gemini-specific errors
        if (geminiError.message && geminiError.message.includes("API_KEY_INVALID")) {
          throw new Error("Gemini API key is invalid. Please verify your API key at https://makersuite.google.com/app/apikey");
        } else if (geminiError.message && geminiError.message.includes("API key")) {
          throw new Error("Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.");
        } else if (geminiError.status === 401 || geminiError.statusCode === 401) {
          throw new Error("Gemini API authentication failed. Please check your API key is correct and has proper permissions.");
        }
        throw geminiError;
      }
      
      // Clean up response if it contains markdown code blocks
      responseText = responseText.trim();
      if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      
      const quizContent = JSON.parse(responseText);
      
      // Validate and structure the quiz data
      if (!quizContent.questions || !Array.isArray(quizContent.questions)) {
        throw new Error("Invalid quiz format received from Gemini");
      }

      // Update quiz with generated questions
      quiz.quizData = {
        questions: quizContent.questions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || ""
        }))
      };
      quiz.status = "completed";
      await quiz.save();

      return NextResponse.json({
        success: true,
        quizId: quiz._id,
        message: "PDF processed and quiz generated successfully!",
        questionsCount: quiz.quizData.questions.length,
      });

    } catch (quizError) {
      console.error("Quiz generation error:", quizError);
      
      // Update quiz status to failed if quiz was created
      try {
        if (quiz && quiz._id) {
          quiz.status = "failed";
          await quiz.save();
        }
      } catch (saveError) {
        console.error("Error saving failed status:", saveError);
      }

      // Handle specific Gemini API errors
      let errorMessage = "PDF processed but quiz generation failed. Please try again.";
      let statusCode = 500;

      // Check for Gemini API errors in different formats
      const errorMsg = quizError.message || "";
      const errorStr = JSON.stringify(quizError).toLowerCase();

      if (quizError.response) {
        // HTTP response error
        const status = quizError.response.status || quizError.response.statusCode;
        const errorData = quizError.response.data || quizError.response.error;

        if (status === 429) {
          errorMessage = "Gemini API quota exceeded. Please check your Google Cloud account billing and quota limits.";
          statusCode = 429;
        } else if (status === 401) {
          errorMessage = "Gemini API key is invalid. Please check your GEMINI_API_KEY environment variable and verify it at https://makersuite.google.com/app/apikey";
          statusCode = 401;
        } else if (status === 400) {
          errorMessage = "Invalid request to Gemini API. The content may be too long or contain invalid characters.";
          statusCode = 400;
        } else {
          errorMessage = `Gemini API error: ${errorData?.message || quizError.message}`;
        }
      } else if (errorMsg.includes("API_KEY_INVALID") || errorMsg.includes("invalid") && errorMsg.includes("API key")) {
        errorMessage = "Gemini API key is invalid. Please verify your API key at https://makersuite.google.com/app/apikey and ensure it's correctly set in your .env.local file.";
        statusCode = 401;
      } else if (errorMsg.includes("API key") || errorMsg.includes("GEMINI_API_KEY") || errorStr.includes("api_key")) {
        errorMessage = errorMsg.includes("invalid") ? errorMsg : "Gemini API key issue. Please check your GEMINI_API_KEY configuration.";
        statusCode = 401;
      } else if (errorMsg.includes("quota") || errorMsg.includes("billing") || errorStr.includes("quota")) {
        errorMessage = "Gemini API quota exceeded. Please check your Google Cloud account billing and quota limits.";
        statusCode = 429;
      } else if (errorMsg.includes("JSON") || errorMsg.includes("parse")) {
        errorMessage = "Failed to parse quiz response. The AI may have returned invalid format. Please try again.";
      } else if (errorMsg.includes("401") || errorStr.includes("401") || errorStr.includes("unauthorized")) {
        errorMessage = "Gemini API authentication failed. Please check that your GEMINI_API_KEY is correct and has proper permissions. Get your key at https://makersuite.google.com/app/apikey";
        statusCode = 401;
      } else {
        errorMessage = quizError.message || errorMessage;
      }

      return NextResponse.json({
        success: false,
        quizId: quiz?._id?.toString() || null,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? quizError.message : undefined
      }, { 
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

  } catch (error) {
    console.error("PDF processing error:", error);
    
    // Ensure we always return JSON, even for unexpected errors
    try {
      return NextResponse.json(
        { 
          error: error.message || "Failed to process PDF. Please try again.",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (jsonError) {
      // Fallback if JSON.stringify fails
      console.error("Critical error returning JSON:", jsonError);
      return new Response(
        JSON.stringify({ 
          error: "An unexpected error occurred. Please try again.",
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
  }
}

