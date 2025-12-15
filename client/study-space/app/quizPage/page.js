"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const quiz_id = searchParams.get("quiz_id");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // stores selected answers
  const [submitted, setSubmitted] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerId = useRef(null);

  useEffect(() => {
    if (!quiz_id) return;

    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/get-quiz?id=${quiz_id}`);
        const data = await res.json();
        setQuiz(data);

        if (data.timerSeconds > 0) {
          setTotalSeconds(data.timerSeconds);
        }

      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [quiz_id]);

  useEffect(() => {
    if (totalSeconds <= 0 || submitted) {
      clearInterval(timerId.current);
      return;
    }
  
    timerId.current = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerId.current);
          setTimerExpired(true);
          handleSubmit(true); 
          return 0;
        }        
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timerId.current);
  }, [totalSeconds, submitted]);

  const handleSingleSelect = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: [optionIndex] 
    }));
  };

  const handleMultipleToggle = (questionIndex, optionIndex) => {
    if (submitted) return;

    setAnswers((prev) => {
      const current = prev[questionIndex] || [];
      return current.includes(optionIndex)
        ? { ...prev, [questionIndex]: current.filter((x) => x !== optionIndex) }
        : { ...prev, [questionIndex]: [...current, optionIndex] };
    });
  };

  const startTimer = () => {
    if (timerId.current) return;
  
    const total = buildTotalSeconds();
    if (total <= 0) return;
  
    setHideInput(true);
    setTimerExpired(false);
    setTotalSeconds(total);
  
    timerId.current = setInterval(() => {
      setTotalSeconds(prev => {
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
  
  const stopTimer = () => {
    clearInterval(timerId.current);
    timerId.current = null;
  };
  
  const resetTimer = () => {
    stopTimer();
    setTimerExpired(false);
    setHideInput(false);
    setTotalSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
  
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = (isForced = false) => {
    if (!isForced && Object.keys(answers).length !== quiz.questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }
  
    let score = 0;
  
    quiz.questions.forEach((q, i) => {
      const correct = [...q.answerIndexes].sort();
      const selected = [...(answers[i] || [])].sort();
  
      const match =
        correct.length === selected.length &&
        correct.every((val, idx) => val === selected[idx]);
  
      if (match) score++;
    });
  
    setScoreCount(score);
    setSubmitted(true);
  };  

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div>
      <h1 className="quizPageTitleText">{quiz.quizTitle}</h1>

      {submitted && (
        <h2 className="score">
          Score: {scoreCount}/{quiz.questions.length}
        </h2>
      )}

      <div className="quizPageTextSecondary">
        Time Remaining: {formatTime(totalSeconds)}
      </div>

      <ul>
        {quiz.questions?.map((q, i) => {
          const selected = answers[i] || [];

          return (
            <li key={i} style={{ marginBottom: "20px" }}>
              <p className="quizPageQuestionText">{i + 1}. {q.question}</p>

             
                {q.questionType === "Dropdown" && (
                   <div className="quizPageOptions">
                  <select
                    onChange={(e) => handleSingleSelect(i, Number(e.target.value))}
                    className="input-quiz-option-main"
                    value={answers[i]?.[0] ?? ""}
                  >
                    <option value="" disabled>Select an answer</option>
                      {q.options.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          {opt}
                        </option>
                      ))}
                  </select>
                  {submitted && (
                  <div>
                    Correct Answer: {q.options[q.answerIndexes[0]]}
                  </div>
                )}
                  </div>

                )}
                
              
              {q.questionType !== "Dropdown" && ( 
                <ul className="quizPageOptions">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selected.includes(optIndex);
                    const isCorrect = submitted && q.answerIndexes.includes(optIndex);
                    const isWrong = submitted && isSelected && !isCorrect;

                    const handleClick =
                      q.questionType === "Multiple Answer"
                        ? () => handleMultipleToggle(i, optIndex)
                        : () => handleSingleSelect(i, optIndex);

                    return (
                      <li
                        key={optIndex}
                        onClick={handleClick}
                        style={{
                          cursor: submitted ? "default" : "pointer",
                          fontWeight: isSelected ? "bold" : "normal",
                          color: isCorrect ? "green" : isWrong ? "red" : "white",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {q.questionType === "Multiple Answer" && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            style={{ marginRight: "8px" }}
                          />
                        )}

                        {opt}
                      </li>
                    );
                  })}
                </ul>
              )}

              {submitted && (
                <p className="quizPageQuestionText">
                  Explanation: {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {!submitted && <button className="submitQuizButton" onClick={handleSubmit}>Submit Quiz</button>}
    </div>
  );
}
