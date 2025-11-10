"use client";
import { useState } from "react";
import { createQuiz } from "@/actions/quiz.action";

export default function CreateQuiz() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [value, setValue] = useState('');
  const [textValue, setTextValue] = useState('');

  const handleNumberChange = (e) => {
    setValue(e.target.value);
  };

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target[1].files[0];
    if (!file) return alert("Please upload a PDF file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
  
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      const extractedText = data.text || "";

      const quizRes = await fetch("/api/gemini-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText, numOfQuestions: value}),
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
    
    }
    catch (error){
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };  

  const handleSubmitText = async (e) => {
    e.preventDefault();

    try {
      setLoadingTwo(true);

      const quizRes = await fetch("/api/gemini-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textValue, numOfQuestions: value}),
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

    }
    catch (error){
      console.log(error);
    }
    finally {
        setLoadingTwo(false);
    }
  }

  return (
    <div>
      <div>Create Quiz by PDF</div>
  
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          className="formInput"
          onChange={handleNumberChange}
          placeholder="Enter # questions"
        />
        <input type="file" className="formInput" />
        <button className="formButton" disabled={loading}>
          {loading ? "Processing PDF...": "Submit PDF"}
        </button>
      </form>

      <div>Create Quiz by Text Input</div>
      <form onSubmit={handleSubmitText}>
        <input
          type="number"
          className="formInput"
          onChange={handleNumberChange}
          placeholder="Enter # questions"
        />
        <input 
          type="text" 
          className="formInput"
          placeholder="Enter text" 
          onChange={handleTextChange}
        />
        <button className="formButton" disabled={loadingTwo}>
          {loadingTwo ? "Processing Text...": "Submit Text"}
        </button>
      </form>
    </div>
  );
}

