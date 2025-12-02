module.exports = [
"[project]/.next-internal/server/app/api/gemini-route/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/gemini-route/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { text, numOfQuestions, quizType, questionType, fileUri, mimeType } = await req.json();
        if (!text || !numOfQuestions || !fileUri) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No text or video input provided"
            }, {
                status: 400
            });
        }
        const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });
        const prompt = `
    You are an expert quiz/flashcard generator. Based on the following text content, 
    generate ${numOfQuestions} questions or flashcards. Below are the different 
    kinds of question types. If quizType is "Quiz", it has the following question 
    types which are "Multiple Choice, True or False, Multiple Answer, Mixed Format".
    If quizType is "Flashcard Set" it has the following question types which are 
    "Definitions, Questions, Random Flashcards". Multiple Choice should have 
    4 options with one correct answer. Include brief explanations for each answer. 
    IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no code blocks, no additional text).
    Multiple Choice:
    {
    "questions": [
        {
        "quizTitle": "Quiz Title here",
        "quizType": "${quizType}",
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": [0],
        "explanation": "Brief explanation of why this answer is correct",
        "questionType": "Multiple Choice"
        }
    ]
    }
    True or False:
    {
      "questions": [
          {
          "quizTitle": "Quiz Title here",
          "quizType": "${quizType}",
          "question": "Question text here?",
          "options": ["True", "False"],
          "correctAnswer": [0],
          "explanation": "Brief explanation of why this answer is correct",
          "questionType": "True or False"
          }
      ]
    }
    Multiple Answer: 
    {
      "questions": [
        {
        "quizTitle": "Quiz Title here",
        "quizType": "${quizType}",
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": [0,..],
        "explanation": "Brief explanation of why this answer is correct",
        "questionType": "Multiple Answer"
        }
      ]
    }
    Mixed Format:
    {
      "questions": [
        {
          "quizTitle": "Quiz Title here",
          "quizType": "${quizType}",
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": [0],
          "explanation": "Brief explanation of why this answer is correct",
          "questionType": "Multiple Choice"
        }
        {
        "quizTitle": "Quiz Title here",
        "quizType": "${quizType}",
        "question": "Question text here?",
        "options": ["True", "False"],
        "correctAnswer": [0],
        "explanation": "Brief explanation of why this answer is correct",
        "questionType": "True or False"
        }
        {
          "quizTitle": "Quiz Title here",
          "quizType": "${quizType}",
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": [0,..],
          "explanation": "Brief explanation of why this answer is correct",
          "questionType": "Multiple Answer"
        }
      ]
    }
    Definitions:
    {
      "questions": [
          {
          "flashcardTitle": "Quiz Title here",
          "quizType": "${quizType}",
          "questions": ["Definition Here", "Definition Here"],
          "answers": ["Term here", "Term here"],
          }
      ]
    }

    Questions:
    {
      "questions": [
          {
          "flashcardTitle": "Quiz Title here",
          "quizType": "${quizType}",
          "questions": ["Question Here", "Question Here"],
          "answers": ["Answer here", "Answer here"],
          }
      ]
    }

    Random Flashcards:
    {
      "questions": [
          {
          "flashcardTitle": "Quiz Title here",
          "quizType": "${quizType}",
          "questions": ["Question or Definition Here", "Question or Definition Here"],
          "answers": ["Answer or Term here", "Answer or Term here"],
          }
      ]
    }

    Text to analyze:
    ${text}
    Number of Questions:
    ${numOfQuestions}
    Quiz Type:
    ${quizType}
    Question Type:
    ${questionType}
    `;
        const videoPart = fileUri ? {
            fileData: {
                fileUri: fileUri,
                mimeType: mimeType
            }
        } : null;
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        ...videoPart ? [
                            videoPart
                        ] : [],
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        });
        const output = result.response.text();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            text: output
        });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate quiz"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bd2f17f0._.js.map