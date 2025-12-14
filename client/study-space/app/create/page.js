"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createQuiz } from "@/actions/quiz.action";
import { createFlashcard } from "@/actions/flashcard.action";
import Quiz from "../components/quiz";
// Icons
import { BsArrowUpCircleFill } from "react-icons/bs";
import { SiYoutube } from "react-icons/si";
import { IoTrashSharp } from "react-icons/io5";
import { GrAdd } from "react-icons/gr";
import {FaTimes } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import Flashcard from "../components/flashcard";
import { GoogleDriveIcon } from "../components/google-drive-icon";
import { GoogleDrivePicker } from "../components/google-drive-picker";
import { GoogleDrivePickerButton } from "../components/google-drive-picker-button";

export default function CreateQuiz() {
  const searchParams = useSearchParams();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState("");
  const [numberCounts, setNumberCounts] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeUrls, setYoutubeUrls] = useState([]);
  const [quizType, setQuizType] = useState("");
  const [numberType, setNumberType] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [pdfFiles, setPdfFiles] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);
  const [showGoogleDrivePicker, setShowGoogleDrivePicker] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [YoutubeBarVisible, setYoutubeBarVisible] = useState(false);
  const [YoutubeVideoDisplay, setYoutubeVideoDisplay] = useState(false);
  const [recentQuiz, setRecentQuiz] = useState(null);
  const [recentFlashcard, setRecentFlashcard] = useState(null);
  const [questionTypes, setQuestionTypes] = useState([]);
  const pdfPickerRef = useRef(null);

  // Save state to localStorage before OAuth redirect
  const savePageState = () => {
    if (typeof window !== 'undefined') {
      const state = {
        quizType,
        numberType,
        questionTypes,
        questionType,
        number,
        numberCounts,
        text,
        textValue,
        youtubeUrl,
        youtubeUrls,
        pdfFiles: pdfFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        driveFiles: driveFiles.map(f => ({ name: f.name || f.driveName, size: f.size })),
      };
      localStorage.setItem('createPageState', JSON.stringify(state));
    }
  };

  // Restore state from localStorage after OAuth callback
  useEffect(() => {
    const googleDriveParam = searchParams.get("google_drive");
    if (googleDriveParam === "connected") {
      // Restore saved state
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem('createPageState');
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            if (state.quizType) setQuizType(state.quizType);
            if (state.numberType) setNumberType(state.numberType);
            if (state.questionTypes?.length) setQuestionTypes(state.questionTypes);
            if (state.questionType) setQuestionType(state.questionType);
            if (state.number) setNumber(state.number);
            if (state.numberCounts?.length) setNumberCounts(state.numberCounts);
            if (state.text) setText(state.text);
            if (state.textValue) setTextValue(state.textValue);
            if (state.youtubeUrl) setYoutubeUrl(state.youtubeUrl);
            if (state.youtubeUrls?.length) setYoutubeUrls(state.youtubeUrls);
            // Note: pdfFiles and driveFiles can't be fully restored (File objects), but names are preserved
            localStorage.removeItem('createPageState');
          } catch (error) {
            console.error("Error restoring page state:", error);
          }
        }
      }
      setShowGoogleDrivePicker(true);
      // Clean up URL by removing the query parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("google_drive");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const fetchRecentQuiz = async () => {
    try {
      const res = await fetch("/api/get-recent-quiz");
      const data = await res.json();
      console.log("Recent Quiz (API Response):", data);
      setRecentQuiz(data);
      setPdfFiles([]);
      setDriveFiles([]);
      setYoutubeUrls([]);
      setTextValue([]);
      setQuizType("");
    } catch (err) {
      console.error("Error fetching recent quiz:", err);
    }
  };

  const fetchRecentFlashcard = async () => {
    try {
      const res = await fetch("/api/get-recent-flashcard");
      const data = await res.json();
      console.log("Recent Flashcard (API Response):", data);
      setRecentFlashcard(data);
      setPdfFiles([]);
      setDriveFiles([]);
      setYoutubeUrls([]);
      setTextValue([]);
      setQuizType("");
    } catch (err) {
      console.error("Error fetching recent quiz:", err);
    }
  };

  const toggleQuestionType = (type) => {
    setQuestionTypes(prev => {
      if (prev.includes(type)) {
        if (numberType == "Multiple Number"){
          const index = prev.indexOf(type);
          setNumberCounts(nums => nums.filter((_, i) => i !== index));
        }
        return prev.filter(t => t !== type);
      } else {
        if (numberType == "Multiple Number"){
          setNumberCounts(nums => [...nums, ""]);
        }
        if (numberType == "Single Number"){
          setNumberCounts([""]);
        }
        return [...prev, type];
      }
    });
  };

  const setNumberCount = (index, value) => {
    if (numberType == "Single Number"){
      setNumberCounts([value]);
    }
    if (numberType == "Multiple Number"){
      setNumberCounts(prev => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    }
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const addYoutubeUrl = () => {
    const url = youtubeUrl.trim();
    if (!url) {
      alert("Please enter a YouTube URL.");
      return;
    }
  
    if (youtubeUrls.includes(url)) {
      alert("This YouTube link was already added.");
      return;
    }
  
    setYoutubeUrls((prev) => [...prev, url]);
  
    toggleYoutubeDisplay(url);
  
    setYoutubeUrl("");
  };  

  const toggleYoutubeBar = () => {
    if (!YoutubeBarVisible) {
      setYoutubeBarVisible(true);
      setDropdownVisible(false);
    } else {
      setYoutubeBarVisible(false);
    }
  };

  const deleteYoutubeBar = () => {
    setYoutubeUrl("");
    setYoutubeBarVisible(false);
  };

  const toggleYoutubeDisplay = (value) => {
    if (!value.trim()) {
      alert("Please enter a YouTube URL.");
      return;
    }
    setYoutubeUrl(value);
    setYoutubeVideoDisplay(true);
    setYoutubeBarVisible(false);
  }

  const extractYouTubeId = (url) => {
    try {
      const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizType) {
      alert("Please select a quiz type to generate a quiz.");
      return;
    }

    if (questionTypes.length == 0) {
      alert("Please select an question type to generate a quiz.");
      return;
    }

    if (numberCounts.length == 0) {
      alert("Please select a number of questions/flashcards to generate a quiz.");
      return;
    }

    try {
        setLoading(true);
        let combinedText = "";
        // Combine regular files and Drive files
        const allFiles = [...pdfFiles, ...driveFiles];

        if (allFiles.length === 0 && !textValue.trim() && youtubeUrls.length == 0) {
          alert("Please enter an input.");
          setLoading(false);
          return;
        }

        if (allFiles.length !== 0) {
          for (const file of allFiles) {
            // Check if file has type property and if it's a video
            // Google Drive files are always PDFs, so handle them accordingly
            const fileType = file.type || file.driveMimeType || "application/pdf";
            
            if (fileType && fileType.startsWith("video/")) {
              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("/api/mp4-route", {
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
              // All other files (PDFs from regular upload or Google Drive) go to parse-pdf
              const formData = new FormData();
              formData.append("file", file);
          
              const res = await fetch("/api/parse-pdf", {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Failed to parse PDF" }));
                throw new Error(errorData.error || "Failed to parse PDF file");
              }
          
              const data = await res.json().catch((err) => {
                console.error("Error parsing parse-pdf response:", err);
                throw new Error("Invalid response from PDF parser");
              });

              if (!data || typeof data !== 'object') {
                throw new Error("Invalid response format from PDF parser");
              }

              combinedText += "\n" + (data.text || "");
            }
          }
        }

        if (textValue.trim()) {
          combinedText += "\n" + textValue;
        }

        if (youtubeUrls.length != 0){
          for (const url of youtubeUrls){
            if (url.trim()){
              const res = await fetch("/api/youtube-route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
              });

              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch YouTube transcript");
              }

              const data = await res.json();
              combinedText += "\n" + (data.text || "");
            }
          }
        }
        
      if (!combinedText.trim()) {
        alert("No content extracted from files. Please ensure your PDF files contain readable text.");
        setLoading(false);
        return;
      }

      const quizRes = await fetch("/api/gemini-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: combinedText.trim(),
          numOfQuestions: numberCounts,
          quizType: quizType,
          questionTypes: questionTypes,
        }),
      });

      if (!quizRes.ok) {
        const errorData = await quizRes.json().catch(() => ({ error: "Failed to generate quiz" }));
        throw new Error(errorData.error || "Failed to generate quiz");
      }

      const quizData = await quizRes.json().catch((err) => {
        console.error("Error parsing gemini-route response:", err);
        throw new Error("Invalid response from quiz generator");
      });

      let parsedQuiz;
      try {
        const textContent = quizData?.text || "";
        if (!textContent) {
            throw new Error("Empty response from AI");
        }
        const cleanedText = textContent.replace(/```json/i, "").replace(/```/g, "").trim();
        
        if (!cleanedText) {
          throw new Error("No JSON content found in AI response");
        }

        parsedQuiz = JSON.parse(cleanedText);
      } catch (error) {
        console.error("Error parsing quizData.text:", error);
        console.error("Raw response:", quizData);
        const textContent = quizData?.text || "";
        const cleanedText = textContent.replace(/```json/i, "").replace(/```/g, "").trim();
        console.error("Cleaned text:", cleanedText);
        alert(`Failed to parse quiz data: ${error.message}. The AI response may be incomplete or invalid.`);
        setLoading(false);
        return;
      }

      if (quizType === "Flashcard") {
        setText(parsedQuiz.flashcardTitle || "");
        await createFlashcard(parsedQuiz);
      } else {
        setText(parsedQuiz.quizTitle || "");
        await createQuiz(parsedQuiz);
      }

      if (quizType === "Flashcard"){
        await fetchRecentFlashcard();
      } else {
        await fetchRecentQuiz();
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
      <input
        type="file"
        accept="application/pdf"
        ref={pdfPickerRef}
        style={{ display: "none" }}
        multiple
        onChange={(e) => {
          const selected = Array.from(e.target.files);
          const uniqueSelected = selected.filter(
            (file) =>
              !pdfFiles.some(
                (existing) =>
                  existing.name === file.name && existing.size === file.size
              )
          );
        
          if (uniqueSelected.length === 0) {
            alert("These files were already added.");
            e.target.value = "";
            return;
          }
        
          setPdfFiles((prev) => [...prev, ...uniqueSelected]);
          e.target.value = "";
        }}
      />

      <div className="centerText">
        <div className="headerText">
          StudySpace.AI
        </div>
        <div className="secondaryHeaderText">
          Automatically generate interactive quizzes from Youtube Links, PDFs, 
         
        </div>
        <div className="secondaryHeaderText">
          or your own notes
        </div>
      </div>
      

      <div className="create-bar-container">
        <select
          onChange={(e) => setQuizType(e.target.value)}
          className="input-quiz-option-main"
          value={quizType}
        >
          <option value="">-- Select a quiz type --</option>
          <option value="Quiz">Quiz</option>
          <option value="Flashcard">Flashcard Set</option>
        </select>

        {quizType == "Quiz" && (
          <div className="checkbox-container">
            <button className="select-all"
              onClick={()=>setQuestionTypes(["Multiple Choice", "True or False", "Multiple Answer", "Dropdown"])}
            >
              Select All
            </button>
            <label>
              <input
                type="checkbox"
                checked={questionTypes.includes("Multiple Choice")}
                onChange={() => toggleQuestionType("Multiple Choice")}
              />
              Multiple Choice
            </label>
            <label>
              <input
                type="checkbox"
                checked={questionTypes.includes("True or False")}
                onChange={() => toggleQuestionType("True or False")}
              />
              True or False
            </label>
            <label>
              <input
                type="checkbox"
                checked={questionTypes.includes("Multiple Answer")}
                onChange={() => toggleQuestionType("Multiple Answer")}
              />
              Multiple Answer
            </label>
            <label>
              <input
                type="checkbox"
                checked={questionTypes.includes("Dropdown")}
                onChange={() => toggleQuestionType("Dropdown")}
              />
              Dropdown
            </label>
            <select
              onChange={(e) => setNumberType(e.target.value)}
              className="input-quiz-option-secondary-two"
              value={numberType}
            >
              <option value="">- Number type -</option>
              <option value="Single Number">Single Number</option>
              <option value="Multiple Number">Multiple Number</option>
            </select>
          </div>
        )}

        {quizType == "Flashcard" && (
          <div className="checkbox-container">
            <button className="select-all"
              onClick={()=>setQuestionTypes(["Definitions", "Questions"])}
            >
              Select All
            </button>
            <label>
              <input
                type="checkbox"
                checked={questionTypes.includes("Definitions")}
                onChange={() => toggleQuestionType("Definitions")}
              />
              Definitions
            </label>
            <label>
              <input
                type="checkbox"
                checked={questionTypes.includes("Questions")}
                onChange={() => toggleQuestionType("Questions")}
              />
              Questions
            </label>
            <select
              onChange={(e) => setNumberType(e.target.value)}
              className="input-quiz-option-secondary-two"
              value={numberType}
            >
              <option value="">- Number type -</option>
              <option value="Single Number">Single Number</option>
              <option value="Multiple Number">Multiple Number</option>
            </select>
          </div>
        )}

        {quizType == "Quiz" && numberType=="Single Number" && (
          <input
            type="number"
            className="input-quiz-option-secondary-two"
            placeholder="# of questions"
            onChange={(e)=> setNumberCount(0, e.target.value)}
            value={numberCounts[0] ?? ""}
          />
        )}

        {quizType == "Quiz" && numberType=="Multiple Number" && questionTypes.length > 0 && (
          questionTypes.map((type, index) => (
            <div key={type}>
              <label>{type}</label>
              <input
                type="number"
                className="input-quiz-option-secondary-two"
                placeholder="# of questions"
                onChange={(e)=> setNumberCount(index, e.target.value)}
                value={numberCounts[index] ?? ""}
              />
            </div>
          ))
        )}

        {quizType == "Flashcard" && numberType=="Single Number" && (
          <input
            type="number"
            className="input-quiz-option-secondary-two"
            placeholder="# of flashcards"
            onChange={(e)=> setNumberCount(0, e.target.value)}
            value={numberCounts[0] ?? ""}
          />
        )}

        {quizType == "Flashcard" && numberType=="Multiple Number" && questionTypes.length > 0 && (
          questionTypes.map((type, index) => (
            <div key={type}>
              <label>{type}</label>
              <input
                type="number"
                className="input-quiz-option-secondary-two"
                placeholder="# of flashcards"
                onChange={(e)=> setNumberCount(index, e.target.value)}
                value={numberCounts[index] ?? ""}
              />
            </div>
          ))
        )}

        {YoutubeBarVisible && (
        <div className="youtube-bar-container">
          <div className="youtube-controls">
            <SiYoutube size={30} 
              color="red"
            />
            <input 
              type="text" 
              placeholder="Enter your YouTube URL here" 
              value={youtubeUrl}
              onChange={
                (e) => setYoutubeUrl(e.target.value)
              }
              className="youtube-Bar"
            />
            <IoTrashSharp size={35} onClick={deleteYoutubeBar} color="grey"/>
            <HiCheck size={40} onClick={addYoutubeUrl} color="grey" />
          </div>
        </div>
        )}
      <div className="search-bar-container">
        {/* Render picker component (hidden, just to initialize the picker) */}
        <div style={{ display: 'none' }}>
          <GoogleDrivePicker
            onFilesSelected={(file) => {
              setDriveFiles(prev => [...prev, file]);
              setShowGoogleDrivePicker(false);
            }}
            selectedDriveFiles={driveFiles}
            onRemoveFile={(index) => {
              setDriveFiles(prev => prev.filter((_, i) => i !== index));
            }}
            autoOpen={showGoogleDrivePicker}
            showButton={false}
            onBeforeConnect={savePageState}
          />
        </div>
        <div className={`pdf-file-list ${pdfFiles.length > 0 || driveFiles.length > 0 || YoutubeVideoDisplay ? "pdf-padding-bottom" : ""}`}>
          {pdfFiles.length > 0 && (
            pdfFiles.map((file, i) => (
            <div key={i} className="pdf-file-item">
              {file.name}
              <button
                type="button"
                className="clear-pdf-btn"
                onClick={() => setPdfFiles(prev => prev.filter((_, index) => index !== i))}
              >
                <FaTimes />
              </button>
            </div>
            ))
          )}

          {driveFiles.length > 0 && (
            driveFiles.map((file, i) => (
            <div key={i} className="pdf-file-item">
              <GoogleDriveIcon size={16} style={{ marginRight: '8px' }} />
              {file.driveName || file.name}
              <button
                type="button"
                className="clear-pdf-btn"
                onClick={() => setDriveFiles(prev => prev.filter((_, index) => index !== i))}
              >
                <FaTimes />
              </button>
            </div>
            ))
          )}

          {youtubeUrls.map((url, i) => (
            <div key={i} className="pdf-file-item youtube-thumb">
            <img
              src={`https://img.youtube.com/vi/${extractYouTubeId(url)}/0.jpg`}
              className="youtube-thumbnail"
            />
            <button
              type="button"
              className="clear-pdf-btn"
              onClick={() =>
              setYoutubeUrls((prev) => prev.filter((_, index) => index !== i))
              }
            >
              <FaTimes />
            </button>
            </div>
          ))}
        </div>

        <div className="search-controls">
          <GrAdd size={20} onClick={toggleDropdown}
            color="black"
          />
          <GoogleDrivePickerButton 
            onFileSelected={(file) => {
              setDriveFiles(prev => [...prev, file]);
            }}
            onBeforeConnect={savePageState}
          />
          {dropdownVisible && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => {
                  pdfPickerRef.current?.click();
                  setDropdownVisible(false);
                }}
              >
                Add PDF File
              </div>
              <div className="dropdown-item"
                onClick={() => {
                  setDropdownVisible(false);
                }}
              >
                Add MP4 File
              </div>
              <div className="dropdown-item" onClick={toggleYoutubeBar}>
                Add Youtube Video
              </div>
            </div>
          )}

          <input 
            type="text" 
            placeholder="Enter your notes here" 
            onChange={(e)=> setTextValue(e.target.value)}
            value={textValue}
          />
            <BsArrowUpCircleFill
              size={30}
              color={loading ? "grey" : "black"}
              onClick={handleSubmit}
            />
        </div>
      </div>
      {recentQuiz != null && (
        <div>
          <Quiz 
            key={recentQuiz._id}
            text={recentQuiz.quizTitle + ": " + recentQuiz.quizType}
            id={recentQuiz._id}
          />
        </div>
      )}
      {recentFlashcard != null && (
        <div>
          <Flashcard
            key={recentFlashcard._id}
            text={recentFlashcard.flashcardTitle + ": " + recentFlashcard.quizType}
            id={recentFlashcard._id}
          />
        </div>
      )}
      </div>
    </div>
  );
}
