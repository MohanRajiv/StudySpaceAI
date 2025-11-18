"use client"
import { useState } from "react"
import { deleteFlashcard, updateFlashcard } from "@/actions/flashcard.action";
import Link from "next/link";


export default function Flashcard({text, id}) {
    const [showUpdateInput, setShowUpdateInput] = useState(false);
    const [newText, setNewText] = useState(text);

    const handleUpdate = (e) => {
        e.preventDefault();
        updateFlashcard(id, newText);
        setShowUpdateInput(!showUpdateInput);
    };

    return (
        <div className="formInput">
            <div>
            <Link key={id} href={`flashcardPage?flashcard_id=${id}`} className="quizHover">
                {text}
            </Link>
            </div>
            {showUpdateInput && (
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    type="text"
                    className="formInput"
                />
            )}

            <div>
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
    )
}