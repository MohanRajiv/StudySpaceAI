"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const quiz_id = searchParams.get("quiz_id");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);

  useEffect(() => {
    if (!quiz_id) return;

    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/get-quiz?id=${quiz_id}`);
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [quiz_id]);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (submitted) return; 
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answerIndexes[0]) score++;
    });

    setScoreCount(score);
    setSubmitted(true);
  };

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div>
      <h1>{quiz.quizTitle}</h1>
      {submitted && (
        <h1
          style={{
            fontWeight:"bold"
          }}
        >
          Score:{scoreCount}/{quiz.questions.length} 
        </h1>
      )}

      <ul>
        {quiz.questions?.map((q, i) => {
          const selected = answers[i];
          const correct = q.answerIndexes[0];

          return (
            <li key={i}>
              <p>
                {i + 1}. {q.question}
              </p>
              <ul className="formInput">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selected === optIndex;
                  const isCorrect = submitted && optIndex === correct;
                  const isWrong =
                    submitted && isSelected && selected !== correct;

                  return (
                    <li
                      key={optIndex}
                      onClick={() => handleOptionSelect(i, optIndex)}
                      style={{
                        cursor: submitted ? "default" : "pointer",
                        fontWeight: isSelected ? "bold" : "normal",
                        color: isCorrect
                          ? "green"
                          : isWrong
                          ? "red"
                          : "black",
                      }}
                    >
                      {opt}
                    </li>
                  );
                })}
                {submitted && (
                <p
                style={{
                  fontWeight: "bold"
                }}   
                >
                  Explanation: {q.explanation}
                </p>
                )}
              </ul>
              
            </li>
          );
        })}
      </ul>

      {!submitted && (
        <button onClick={handleSubmit}>Submit Quiz</button>
      )}
    </div>
  );
}
