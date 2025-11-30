"use client";
import { useState } from "react";
import { createQuiz } from "@/actions/quiz.action";
import { createFlashcard } from "@/actions/flashcard.action";

export default function CreateQuiz() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [quizType, setQuizType] = useState("");
  const [inputType, setInputType] = useState("");
  const [pdfFiles, setPdfFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizType) {
      alert("Please select a quiz type to generate a quiz.");
      return;
    }

    if (!inputType) {
      alert("Please select an input type.");
      return;
    }

    try {
      setLoading(true);
      let extractedText = "";
      let uploadedVideoUri = null;
      let uploadedVideoMimeType = null;

      if (inputType === "PDF") {
        const files = Array.from(e.target.querySelector('input[type="file"]').files);
        if (files.length === 0) {
          alert("Please upload at least one PDF file");
          return;
        }
      
        let combinedText = "";
      
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
      
          const res = await fetch("/api/parse-pdf", {
            method: "POST",
            body: formData,
          });
      
          const data = await res.json();
          combinedText += "\n" + (data.text || "");
        }
      
        extractedText = combinedText.trim();
      }      
      else if (inputType === "Text") {
        if (!textValue.trim()) {
          alert("Please enter text to generate the quiz.");
          return;
        }
        extractedText = textValue;
      }
      else if (inputType === "YouTube") {
        if (!youtubeUrl.trim()) {
          alert("Please enter a YouTube URL.");
          return;
        }

        const res = await fetch("/api/youtube-route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: youtubeUrl.trim() }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch YouTube transcript");
        }

        const data = await res.json();
        extractedText = data.text || "";

        if (!extractedText) {
          throw new Error("No transcript text was returned from the video.");
        }
      }
      else if (inputType === "MP4") {
        const files = Array.from(e.target.querySelector('input[type="file"]').files);
        if (files.length === 0) {
          alert("Please upload an MP4 video file");
          return;
        }

        const file = files[0];
        if (!file.type.startsWith("video/")) {
          alert("Please upload a valid video file (MP4)");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to upload video");
        }

        const data = await res.json();
        uploadedVideoUri = data.fileUri;
        uploadedVideoMimeType = data.mimeType;
        extractedText = ""; // Video will be processed by Gemini directly
      }
      else if (inputType === "Multimodal") {
        let combinedText = "";
        const files = Array.from(e.target.querySelector('input[type="file"]').files);

        if ((files.length == 0) && !(textValue.trim()) && !(youtubeUrl.trim())){
          alert("Please enter a input.");
          return;
        }

        if (files.length != 0) {
          for (const file of files) {
            if (file.type.startsWith("video/")) {
              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("/api/upload-video", {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to upload video");
              }

              const data = await res.json();
              uploadedVideoUri = data.fileUri;
              uploadedVideoMimeType = data.mimeType;
            } else {
              const formData = new FormData();
              formData.append("file", file);
          
              const res = await fetch("/api/parse-pdf", {
                method: "POST",
                body: formData,
              });
          
              const data = await res.json();
              combinedText += "\n" + (data.text || "");
            }
          }
        }
        if (textValue.trim()) {
          combinedText += "\n" + textValue;
        }
        if (youtubeUrl.trim()) {
          const res = await fetch("/api/youtube-route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: youtubeUrl.trim() }),
          });
  
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch YouTube transcript");
          }
  
          const data = await res.json();
          combinedText += "\n" + (data.text || "");
        }
        
        extractedText = combinedText.trim();
      }

      const quizRes = await fetch("/api/gemini-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          numOfQuestions: value,
          quizType: quizType,
          fileUri: uploadedVideoUri,
          mimeType: uploadedVideoMimeType
        }),
      });

      const quizData = await quizRes.json();
      
      if (!quizRes.ok) {
        throw new Error(quizData.error || "Failed to generate quiz");
      }

      let parsedQuiz;
      try {
        const textContent = quizData.text || "";
        if (!textContent) {
            throw new Error("Empty response from AI");
        }
        const cleanedText = textContent
          .replace(/```json/i, "")
          .replace(/```/g, "")
          .trim();

        parsedQuiz = JSON.parse(cleanedText);
      } catch (error) {
        console.error("Error parsing quizData.text:", error);
        alert("Failed to parse quiz data — Gemini output wasn't valid JSON");
        return;
      }

      if (quizType == "Flashcard"){
        setText(parsedQuiz.flashcardTitle || "");
        await createFlashcard(parsedQuiz);
      }
      else {
        setText(parsedQuiz.quizTitle || "");
        await createQuiz(parsedQuiz);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating the quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>Create Quiz</div>
      <form onSubmit={handleSubmit}>
        <select
          onChange={(e) => setQuizType(e.target.value)}
          className="formInput"
          value={quizType}
        >
          <option value="">-- Select a quiz type --</option>
          <option value="Multiple Choice">Multiple Choice</option>
          <option value="True or False">True or False</option>
          <option value="Multiple Answer">Multiple Answer</option>
          <option value="Mixed Format">Mixed Format</option>
          <option value="Flashcard">Flashcard Set</option>
        </select>

        <select
          onChange={(e) => setInputType(e.target.value)}
          className="formInput"
          value={inputType}
        >
          <option value="">-- Select an input type --</option>
          <option value="PDF">PDF</option>
          <option value="Text">Text</option>
          <option value="YouTube">YouTube</option>
          <option value="MP4">MP4</option>
          <option value="Multimodal">Multimodal</option>
        </select>

        <input
          type="number"
          value={value}
          className="formInput"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter # of questions"
        />

        {(inputType === "PDF" || inputType === "Multimodal") && (
          <>
            <input
              type="file"
              className="formInput"
              multiple accept="application/pdf, video/mp4, video/quicktime"
              onChange={(e) => setPdfFiles(Array.from(e.target.files))}
            />
          </>
        )}

        {inputType === "MP4" && (
          <>
            <input
              type="file"
              className="formInput"
              accept="video/mp4, video/quicktime, video/x-msvideo, video/webm"
              onChange={(e) => setPdfFiles(Array.from(e.target.files))}
            />
          </>
        )}      

        {(inputType === "Text" || inputType === "Multimodal") && (
          <input
            type="text"
            value={textValue}
            className="formInput"
            placeholder="Enter text"
            onChange={(e) => setTextValue(e.target.value)}
          />
        )}

        {(inputType === "YouTube" || inputType === "Multimodal") && (
          <input
            type="url"
            value={youtubeUrl}
            className="formInput"
            placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        )}

        <button className="formButton" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
