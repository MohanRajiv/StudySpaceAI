import Quiz from "../components/quiz";
import { getQuizzes } from "@/actions/quiz.action";
import Link from "next/link";
import QuizPage from "../quizPage/page";

export default async function historyPage(){
    const quizzes = await getQuizzes();
    console.log(quizzes);

    return (
        <div>
            <h1>View your saved quizzes here</h1>
            <div>
                {quizzes && quizzes.map(quizzes => {
                    return (
                        <Quiz 
                        key={quizzes._id}
                        text={quizzes.quizTitle}
                        id={quizzes._id}
                        />
                    );
                })}
            </div>
        </div>
    );
    
}