import { Schema, model, models } from "mongoose";

const flashcardSchema = new Schema({
  clerkId: { type: String, required: true },
  flashcardTitle: { type: String, required: true },
  questions: [String],
  answers: [String],
  quizType: {type: String},
});

const FlashcardModel = models.FlashcardModel || model("FlashcardModel", flashcardSchema);

export default FlashcardModel;