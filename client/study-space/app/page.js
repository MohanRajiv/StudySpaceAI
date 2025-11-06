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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setError("");
    setSuccess("");
    
    // Validate based on active tab
    if (activeTab === "youtube" && !youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }
    if (activeTab === "pdf" && !pdfFile) {
      setError("Please select a PDF file");
      return;
    }
    if (activeTab === "transcript" && !transcriptText.trim()) {
      setError("Please enter transcript text");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      if (activeTab === "pdf") {
        // Handle PDF upload
        const formData = new FormData();
        formData.append("file", pdfFile);
        
        const response = await fetch("/api/pdf", {
          method: "POST",
          body: formData,
        });
        
        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        let data;
        
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          // If not JSON, read as text to see what we got
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("Server returned an invalid response. Please check your OpenAI API key configuration.");
        }
        
        if (!response.ok) {
          let errorMsg = data.error || "Failed to process PDF";
          
          // Provide more helpful messages for specific errors
          if (response.status === 429) {
            errorMsg = "Gemini API quota exceeded. Please check your Google Cloud account billing and quota limits. Visit https://makersuite.google.com/app/apikey to manage your API key.";
          } else if (response.status === 401) {
            errorMsg = "Gemini API key is invalid or missing. Please check your GEMINI_API_KEY configuration. Get your API key at https://makersuite.google.com/app/apikey";
          }
          
          console.error("PDF upload error:", data);
          throw new Error(errorMsg);
        }
        
        setSuccess(data.message || "PDF processed successfully! Quiz generation will begin shortly.");
        setPdfFile(null);
        // Reset file input
        const fileInput = document.getElementById("pdf-upload");
        if (fileInput) fileInput.value = "";
        
      } else if (activeTab === "youtube") {
        // TODO: Implement YouTube processing
        setTimeout(() => {
          setSuccess("YouTube processing will be implemented soon!");
          setYoutubeUrl("");
        }, 1000);
      } else if (activeTab === "transcript") {
        // TODO: Implement transcript processing
        setTimeout(() => {
          setSuccess("Transcript processing will be implemented soon!");
          setTranscriptText("");
        }, 1000);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setIsGenerating(false);
    }
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
                  onClick={() => {
                    setActiveTab("youtube");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === "youtube"
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  YouTube Video
                </button>
                <button
                  onClick={() => {
                    setActiveTab("pdf");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === "pdf"
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  PDF Document
                </button>
                <button
                  onClick={() => {
                    setActiveTab("transcript");
                    setError("");
                    setSuccess("");
                  }}
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
              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    ⚠️ {error}
                  </p>
                </div>
              )}
              
              {/* Success Message */}
              {success && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    ✅ {success}
                  </p>
                </div>
              )}
              
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
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              // Validate file size (10MB limit)
                              if (file.size > 10 * 1024 * 1024) {
                                setError("File size too large. Please upload a PDF smaller than 10MB.");
                                e.target.value = "";
                                return;
                              }
                              setPdfFile(file);
                              setError("");
                            }
                          }}
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
                          {pdfFile && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                              {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
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
