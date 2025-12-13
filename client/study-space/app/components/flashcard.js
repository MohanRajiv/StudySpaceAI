"use client"
import { useState } from "react"
import { deleteFlashcard, updateFlashcard } from "@/actions/flashcard.action";
import Link from "next/link";
import { PiCardsLight } from "react-icons/pi";

export default function Flashcard({text, id}) {
    const [showUpdateInput, setShowUpdateInput] = useState(false);
    const [newText, setNewText] = useState(text);

    const handleUpdate = (e) => {
        e.preventDefault();
        updateFlashcard(id, newText);
        setShowUpdateInput(!showUpdateInput);
    };

    return (
        <div className="history-quiz-item">
            <div className="quiz-top">
                <div className="quiz-top-icon">
                    <PiCardsLight 
                        size={50}
                    />
                </div>
            </div>


            <div className="quiz-bottom">
                <Link key={id} href={`flashcardPage?flashcard_id=${id}`} className="quizHover">
                    {text}
                </Link>

                {showUpdateInput && (
                    <input
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        type="text"
                        className="formInput"
                    />
                )}

                <div className="quiz-buttons">
                {showUpdateInput ? (
                    <button onClick={() => setShowUpdateInput(!showUpdateInput)}>
                        Cancel
                    </button>
                ) : (
                    <button onClick={() => deleteFlashcard(id)}>
                        Delete
                    </button>
                )}

                {showUpdateInput ? (
                    <button onClick={handleUpdate}>
                        Save
                    </button>
                ) : (
                    <button onClick={() => setShowUpdateInput(!showUpdateInput)}>
                        Update
                    </button>
                )}
                </div>
            </div>
        </div>
    )
}