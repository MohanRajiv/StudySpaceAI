import { Schema, model, models } from "mongoose";

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  explanation: { type: String, required: true },
  answerIndex: { type: Number, required: true },
});


const quizSchema = new Schema({
  clerkId: { type: String, required: true },
  quizTitle: { type: String, required: true },
  questions: [questionSchema],
});


const QuizModel = models.QuizModel || model("QuizModel", quizSchema);

export default QuizModel;