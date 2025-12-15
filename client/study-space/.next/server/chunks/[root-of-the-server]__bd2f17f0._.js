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
        const { text, numOfQuestions, quizType, questionTypes, timerSeconds } = await req.json();
        if (!text || !numOfQuestions) {
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            text: output,
            timerSeconds
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