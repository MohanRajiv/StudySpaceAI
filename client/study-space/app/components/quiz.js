"use client"
import { useState } from "react"
import { deleteQuiz, updateQuiz } from "@/actions/quiz.action";
import Link from "next/link";

export default function Quiz({ text, id }) {
    const [showUpdateInput, setShowUpdateInput] = useState(false);
    const [newText, setNewText] = useState(text);

    const handleUpdate = (e) => {
        e.preventDefault();
        updateQuiz(id, newText);
        setShowUpdateInput(false);
    };

    return (
        <div className="history-quiz-item">
            {/* Top section: optional image or icon */}
            <div className="quiz-top">
                {/* You can add an image or icon here */}
            </div>

            {/* Bottom section: black background with text and buttons */}
            <div className="quiz-bottom">
                <Link key={id} href={`quizPage?quiz_id=${id}`} className="quizHover">
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
                        <>
                            <button onClick={() => setShowUpdateInput(false)}>
                                Cancel
                            </button>
                            <button onClick={handleUpdate}>
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => deleteQuiz(id)}>
                                Delete
                            </button>
                            <button onClick={() => setShowUpdateInput(true)}>
                                Update
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
