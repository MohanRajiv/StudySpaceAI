"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function QuizPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id;
  
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!user || !quizId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setQuiz(data.quiz);
        } else {
          setError(data.error || "Failed to load quiz");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [user, quizId]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (showResults) return; // Don't allow changes after submission
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmit = () => {
    if (!quiz?.quizData?.questions) return;

    let correctCount = 0;
    quiz.quizData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-slate-600 dark:text-slate-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">⚠️ {error}</p>
            <Link
              href="/history"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Back to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.quizData?.questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Quiz not found or not available
            </p>
            <Link
              href="/history"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Back to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const questions = quiz.quizData.questions;
  const totalQuestions = questions.length;
  const allAnswered = Object.keys(selectedAnswers).length === totalQuestions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {quiz.pdfFileName || "Quiz"}
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {totalQuestions} {totalQuestions === 1 ? "question" : "questions"}
            </p>
          </div>
          <Link
            href="/history"
            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Back to History
          </Link>
        </div>

        {/* Score Display */}
        {showResults && (
          <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-2xl mb-4">
              You scored {score} out of {totalQuestions}
            </p>
            <p className="text-xl opacity-90">
              {Math.round((score / totalQuestions) * 100)}% Correct
            </p>
            <button
              onClick={resetQuiz}
              className="mt-4 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, index) => {
            const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
            const isSelected = selectedAnswers[q.id] !== undefined;
            const showAnswer = showResults;

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 ${
                  showAnswer
                    ? isCorrect
                      ? "ring-2 ring-green-500"
                      : isSelected
                      ? "ring-2 ring-red-500"
                      : ""
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Question {index + 1}
                  </h3>
                  {showAnswer && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  )}
                </div>

                <p className="text-slate-700 dark:text-slate-300 mb-4 text-lg">
                  {q.question}
                </p>

                <div className="space-y-2 mb-4">
                  {q.options.map((option, optIndex) => {
                    const isSelectedOption = selectedAnswers[q.id] === optIndex;
                    const isCorrectOption = optIndex === q.correctAnswer;
                    let optionClass =
                      "w-full text-left p-4 rounded-lg border-2 transition-colors";

                    if (showAnswer) {
                      if (isCorrectOption) {
                        optionClass += " bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-300";
                      } else if (isSelectedOption && !isCorrectOption) {
                        optionClass += " bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-300";
                      } else {
                        optionClass += " border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400";
                      }
                    } else {
                      optionClass += isSelectedOption
                        ? " border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-300"
                        : " border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 cursor-pointer";
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswerSelect(q.id, optIndex)}
                        disabled={showAnswer}
                        className={optionClass}
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-3">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span>{option}</span>
                          {showAnswer && isCorrectOption && (
                            <span className="ml-auto text-green-600 dark:text-green-400">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showAnswer && q.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!showResults && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                allAnswered
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              }`}
            >
              {allAnswered
                ? "Submit Quiz"
                : `Answer ${totalQuestions - Object.keys(selectedAnswers).length} more question${totalQuestions - Object.keys(selectedAnswers).length === 1 ? "" : "s"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

