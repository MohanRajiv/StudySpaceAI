"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading quizzes - replace with actual API call
    setTimeout(() => {
      setQuizzes([]); // Empty for now, will be populated from API
      setIsLoading(false);
    }, 1000);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Quiz History
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            View and manage all your generated quizzes
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <svg
              className="animate-spin h-12 w-12 text-indigo-600"
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
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-slate-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No quizzes yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Generate your first quiz to see it here
            </p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Create Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded">
                    {quiz.type}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {quiz.questionsCount} questions
                </p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                  View Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}