"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function FlashcardPage() {
    const searchParams = useSearchParams();
    const flashcard_id = searchParams.get("flashcard_id");
    const [flashcard, setFlashcard] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!flashcard_id) return;
    
        const fetchFlashcard = async () => {
          try {
            const res = await fetch(`/api/get-flashcard?id=${flashcard_id}`);
            const data = await res.json();
            setFlashcard(data);
          } catch (err) {
            console.error("Error fetching quiz:", err);
          }
        };
    
        fetchFlashcard();
    }, [flashcard_id]);

    const handleShowAnswer = () => {
        if (showAnswer){
            setShowAnswer(false);
        } 
        else {
            setShowAnswer(true);
        }
    };

    const handleNextIndex = () => {
        if (index == flashcard.questions.length-1){
            setIndex(0);
        } 
        else {
            setIndex(index+1);
        }
    };

    const handlePreviousIndex = () => {
        if (index == 0){
            setIndex(flashcard.questions.length-1);
        } 
        else {
            setIndex(index-1);
        }
    };

    if (!flashcard) return <div>Flashcard not found</div>;

    return (
        <div>
            <h1 className="quizPageTextMain">{flashcard.flashcardTitle}</h1>
            <div className="quizPageQuestionText" onClick={handleShowAnswer}>
                <div className="quizHover">
                {!showAnswer && (
                    <p>{flashcard.questions[index]}</p>
                )}
                {showAnswer && (
                    <p>{flashcard.answers[index]}</p>
                )}
                </div>
            </div>
            <button className="formButton" onClick={handlePreviousIndex}>Previous</button>
            <button className="formButton" onClick={handleNextIndex}>Next</button>

        </div>
    );
}