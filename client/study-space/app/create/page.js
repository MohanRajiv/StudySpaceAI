"use client";
import { useState } from "react";
import { createQuiz } from "@/actions/quiz.action";

export default function CreateQuiz() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [quizType, setQuizType] = useState("");
  const [inputType, setInputType] = useState("");

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

      if (inputType === "PDF") {
        const file = e.target.querySelector('input[type="file"]').files[0];
        if (!file) {
          alert("Please upload a PDF file");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        extractedText = data.text || "";
      } 
      else if (inputType === "Text") {
        if (!textValue.trim()) {
          alert("Please enter text to generate the quiz.");
          return;
        }
        extractedText = textValue;
      }

      const quizRes = await fetch("/api/gemini-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          numOfQuestions: value,
          quizType: quizType,
        }),
      });

      const quizData = await quizRes.json();

      let parsedQuiz;
      try {
        const cleanedText = quizData.text
          .replace(/```json/i, "")
          .replace(/```/g, "")
          .trim();

        parsedQuiz = JSON.parse(cleanedText);
      } catch (error) {
        console.error("Error parsing quizData.text:", error);
        alert("Failed to parse quiz data — Gemini output wasn't valid JSON");
        return;
      }

      setText(parsedQuiz.quizTitle || "");
      await createQuiz(parsedQuiz);
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
          <option value="Mixed Format">Mixed Format</option>
        </select>

        <select
          onChange={(e) => setInputType(e.target.value)}
          className="formInput"
          value={inputType}
        >
          <option value="">-- Select an input type --</option>
          <option value="PDF">PDF</option>
          <option value="Text">Text</option>
        </select>

        <input
          type="number"
          value={value}
          className="formInput"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter # of questions"
        />

        {inputType === "PDF" && (
          <input type="file" className="formInput" />
        )}

        {inputType === "Text" && (
          <input
            type="text"
            value={textValue}
            className="formInput"
            placeholder="Enter text"
            onChange={(e) => setTextValue(e.target.value)}
          />
        )}

        <button className="formButton" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
