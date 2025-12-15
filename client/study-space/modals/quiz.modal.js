import { Schema, model, models } from "mongoose";

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  explanation: { type: String, required: true },
  answerIndexes: [Number],
  questionType: {type: String},
});


const quizSchema = new Schema({
  clerkId: { type: String, required: true },
  quizTitle: { type: String, required: true },
  questions: [questionSchema],
  quizType: {type: String},
  timerSeconds: { type: Number},
}, { timestamps: true });

const QuizModel = models.QuizModel || model("QuizModel", quizSchema);

export default QuizModel;