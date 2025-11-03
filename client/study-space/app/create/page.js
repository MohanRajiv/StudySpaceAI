export default function createPage(){
    return (
        <div>
        <h1>Create Your Quizzes Here</h1>
            <form>
                <div className="stackElements">
                <input
                    type = "text"
                    placeholder = "Question Input"
                    className="formInput"
                />
                <input
                    type = "text"
                    placeholder = "Answer Input"
                    className="formInput"
                />
                <button className="formButton">Add Quiz</button>
                </div>
                
            </form>
        </div>
    
    );
}