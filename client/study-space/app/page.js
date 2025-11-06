"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      const createUserInDB = async () => {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
          }),
        });
      };
      createUserInDB();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate based on active tab
    if (activeTab === "youtube" && !youtubeUrl.trim()) {
      return;
    }
    if (activeTab === "pdf" && !pdfFile) {
      return;
    }
    if (activeTab === "transcript" && !transcriptText.trim()) {
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call - replace with actual API endpoint
    setTimeout(() => {
      setIsGenerating(false);
      alert("Quiz generation is in progress! This will be connected to your backend.");
      // Reset form
      setYoutubeUrl("");
      setPdfFile(null);
      setTranscriptText("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            StudySpace
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Automatically generate interactive quizzes from YouTube links, Zoom transcripts, and PDFs
          </p>
        </div>

        <SignedOut>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              Please sign in to generate quizzes
            </p>
            <Link
              href="/sign-in"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("youtube")}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === "youtube"
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  YouTube Video
                </button>
                <button
                  onClick={() => setActiveTab("pdf")}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === "pdf"
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  PDF Document
                </button>
                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === "transcript"
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Zoom Transcript
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* YouTube Tab */}
                {activeTab === "youtube" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        YouTube Video URL
                      </label>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        📹 Paste a YouTube video URL and we'll extract the content to generate your quiz
                      </p>
                    </div>
                  </div>
                )}

                {/* PDF Tab */}
                {activeTab === "pdf" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Upload PDF File
                      </label>
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setPdfFile(e.target.files[0])}
                          className="hidden"
                          id="pdf-upload"
                          required
                        />
                        <label
                          htmlFor="pdf-upload"
                          className="cursor-pointer block"
                        >
                          <svg
                            className="mx-auto h-12 w-12 text-slate-400 mb-4"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            {pdfFile ? pdfFile.name : "Click to upload PDF"}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        📄 Upload a PDF document and we'll analyze it to create your quiz
                      </p>
                    </div>
                  </div>
                )}

                {/* Transcript Tab */}
                {activeTab === "transcript" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Zoom Transcript Text
                      </label>
                      <textarea
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Paste your Zoom transcript here..."
                        rows={8}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        💬 Paste your Zoom meeting transcript and we'll generate questions from it
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
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
                      Generating Quiz...
                    </>
                  ) : (
                    "Generate Quiz"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/history"
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                View Quiz History
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                See all your previously generated quizzes
              </p>
            </Link>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                How It Works
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Upload content → AI analyzes → Get interactive quiz instantly
              </p>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
