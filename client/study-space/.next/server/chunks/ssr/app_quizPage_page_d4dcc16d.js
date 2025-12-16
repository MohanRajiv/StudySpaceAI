module.exports = [
"[project]/app/quizPage/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuizPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function QuizPage() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const quiz_id = searchParams.get("quiz_id");
    const [quiz, setQuiz] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scoreCount, setScoreCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalSeconds, setTotalSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [timerExpired, setTimerExpired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const timerId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hideTimer, setHideTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!quiz_id) return;
        const fetchQuiz = async ()=>{
            try {
                const res = await fetch(`/api/get-quiz?id=${quiz_id}`);
                const data = await res.json();
                setQuiz(data);
                if (data.timerSeconds > 0) {
                    setTotalSeconds(data.timerSeconds);
                } else {
                    setHideTimer(true);
                }
            } catch (err) {
                console.error("Error fetching quiz:", err);
            }
        };
        fetchQuiz();
    }, [
        quiz_id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (totalSeconds <= 0 || submitted) {
            clearInterval(timerId.current);
            return;
        }
        timerId.current = setInterval(()=>{
            setTotalSeconds((prev)=>{
                if (prev <= 1) {
                    clearInterval(timerId.current);
                    setTimerExpired(true);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return ()=>clearInterval(timerId.current);
    }, [
        totalSeconds,
        submitted
    ]);
    const handleSingleSelect = (questionIndex, optionIndex)=>{
        if (submitted) return;
        setAnswers((prev)=>({
                ...prev,
                [questionIndex]: [
                    optionIndex
                ]
            }));
    };
    const handleMultipleToggle = (questionIndex, optionIndex)=>{
        if (submitted) return;
        setAnswers((prev)=>{
            const current = prev[questionIndex] || [];
            return current.includes(optionIndex) ? {
                ...prev,
                [questionIndex]: current.filter((x)=>x !== optionIndex)
            } : {
                ...prev,
                [questionIndex]: [
                    ...current,
                    optionIndex
                ]
            };
        });
    };
    const startTimer = ()=>{
        if (timerId.current) return;
        const total = buildTotalSeconds();
        if (total <= 0) return;
        setHideInput(true);
        setTimerExpired(false);
        setTotalSeconds(total);
        timerId.current = setInterval(()=>{
            setTotalSeconds((prev)=>{
                if (prev <= 1) {
                    clearInterval(timerId.current);
                    timerId.current = null;
                    setTimerExpired(true);
                    setHideInput(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    const stopTimer = ()=>{
        clearInterval(timerId.current);
        timerId.current = null;
    };
    const resetTimer = ()=>{
        stopTimer();
        setTimerExpired(false);
        setHideInput(false);
        setTotalSeconds(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };
    const formatTime = (secs)=>{
        const h = Math.floor(secs / 3600);
        const m = Math.floor(secs % 3600 / 60);
        const s = secs % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };
    const handleSubmit = (isForced = false)=>{
        if (!isForced && Object.keys(answers).length !== quiz.questions.length) {
            alert("Please answer all questions before submitting!");
            return;
        }
        let score = 0;
        quiz.questions.forEach((q, i)=>{
            const correct = [
                ...q.answerIndexes
            ].sort();
            const selected = [
                ...answers[i] || []
            ].sort();
            const match = correct.length === selected.length && correct.every((val, idx)=>val === selected[idx]);
            if (match) score++;
        });
        setScoreCount(score);
        setSubmitted(true);
    };
    if (!quiz) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Quiz not found"
    }, void 0, false, {
        fileName: "[project]/app/quizPage/page.js",
        lineNumber: 151,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "quizPageTitleText",
                children: quiz.quizTitle
            }, void 0, false, {
                fileName: "[project]/app/quizPage/page.js",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "score",
                children: [
                    "Score: ",
                    scoreCount,
                    "/",
                    quiz.questions.length
                ]
            }, void 0, true, {
                fileName: "[project]/app/quizPage/page.js",
                lineNumber: 158,
                columnNumber: 9
            }, this),
            !hideTimer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "quizPageTextSecondary",
                children: [
                    "Time Remaining: ",
                    formatTime(totalSeconds)
                ]
            }, void 0, true, {
                fileName: "[project]/app/quizPage/page.js",
                lineNumber: 164,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                children: quiz.questions?.map((q, i)=>{
                    const selected = answers[i] || [];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        style: {
                            marginBottom: "20px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "quizPageQuestionText",
                                children: [
                                    i + 1,
                                    ". ",
                                    q.question
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/quizPage/page.js",
                                lineNumber: 175,
                                columnNumber: 15
                            }, this),
                            q.questionType === "Dropdown" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "quizPageOptions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        onChange: (e)=>handleSingleSelect(i, Number(e.target.value)),
                                        className: "input-quiz-option-main",
                                        value: answers[i]?.[0] ?? "",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                disabled: true,
                                                children: "Select an answer"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quizPage/page.js",
                                                lineNumber: 184,
                                                columnNumber: 21
                                            }, this),
                                            q.options.map((opt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: idx,
                                                    children: opt
                                                }, idx, false, {
                                                    fileName: "[project]/app/quizPage/page.js",
                                                    lineNumber: 186,
                                                    columnNumber: 25
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quizPage/page.js",
                                        lineNumber: 179,
                                        columnNumber: 19
                                    }, this),
                                    submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Correct Answer: ",
                                            q.options[q.answerIndexes[0]]
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quizPage/page.js",
                                        lineNumber: 192,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/quizPage/page.js",
                                lineNumber: 178,
                                columnNumber: 20
                            }, this),
                            q.questionType !== "Dropdown" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "quizPageOptions",
                                children: q.options.map((opt, optIndex)=>{
                                    const isSelected = selected.includes(optIndex);
                                    const isCorrect = submitted && q.answerIndexes.includes(optIndex);
                                    const isWrong = submitted && isSelected && !isCorrect;
                                    const handleClick = q.questionType === "Multiple Answer" ? ()=>handleMultipleToggle(i, optIndex) : ()=>handleSingleSelect(i, optIndex);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        onClick: handleClick,
                                        style: {
                                            cursor: submitted ? "default" : "pointer",
                                            fontWeight: isSelected ? "bold" : "normal",
                                            color: isCorrect ? "green" : isWrong ? "red" : "white",
                                            display: "flex",
                                            alignItems: "center"
                                        },
                                        children: [
                                            q.questionType === "Multiple Answer" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: isSelected,
                                                readOnly: true,
                                                style: {
                                                    marginRight: "8px"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/quizPage/page.js",
                                                lineNumber: 226,
                                                columnNumber: 27
                                            }, this),
                                            opt
                                        ]
                                    }, optIndex, true, {
                                        fileName: "[project]/app/quizPage/page.js",
                                        lineNumber: 214,
                                        columnNumber: 23
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/quizPage/page.js",
                                lineNumber: 202,
                                columnNumber: 17
                            }, this),
                            submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "quizPageQuestionText",
                                children: [
                                    "Explanation: ",
                                    q.explanation
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/quizPage/page.js",
                                lineNumber: 242,
                                columnNumber: 17
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/app/quizPage/page.js",
                        lineNumber: 174,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/quizPage/page.js",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            !submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "submitQuizButton",
                onClick: handleSubmit,
                children: "Submit Quiz"
            }, void 0, false, {
                fileName: "[project]/app/quizPage/page.js",
                lineNumber: 250,
                columnNumber: 22
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/quizPage/page.js",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_quizPage_page_d4dcc16d.js.map