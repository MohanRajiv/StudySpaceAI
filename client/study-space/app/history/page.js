import Quiz from "../components/quiz";
import Flashcard from "../components/flashcard";
import { getQuizzes } from "@/actions/quiz.action";
import { getFlashcards } from "@/actions/flashcard.action";

export default async function historyPage(){
    const quizzes = await getQuizzes();
    const flashcards = await getFlashcards();
    console.log(quizzes);
    console.log(flashcards);

    return (
        <div>
            <h1>Quizzes</h1>
            <h3>View your quizzes</h3>
            <div className="history-quiz-list">
                {quizzes && quizzes.map(quizzes => {
                    return (
                        <Quiz 
                            key={quizzes._id}
                            text={quizzes.quizTitle + ": " + quizzes.quizType}
                            id={quizzes._id}
                        />
                    );
                })}
                {flashcards && flashcards.map(flashcards => {
                    return (
                        <Flashcard 
                            key={flashcards._id}
                            text={flashcards.flashcardTitle + ": " + flashcards.quizType}
                            id={flashcards._id}
                        />
                    );
                })}
            </div>
        </div>
    );
    
}