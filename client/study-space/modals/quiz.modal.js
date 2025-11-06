import { Schema, model, models } from "mongoose";

const quizSchema = new Schema({
  clerkId: { type: String, required: true },
  sourceType: { 
    type: String, 
    required: true, 
    enum: ["youtube", "pdf", "transcript"] 
  },
  sourceContent: { type: String }, // For YouTube URL or transcript text
  pdfFileName: { type: String }, // For PDF uploads
  extractedText: { type: String }, // Extracted text from PDF or transcript
  quizData: { type: Schema.Types.Mixed }, // Store quiz questions and answers
  status: { 
    type: String, 
    enum: ["processing", "completed", "failed"], 
    default: "processing" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Quiz = models.Quiz || model("Quiz", quizSchema);

export default Quiz;

