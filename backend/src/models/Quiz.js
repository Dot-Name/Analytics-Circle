import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionImage: { type: String, default: null },
  options: [{ type: String, required: true }], 
  // Index value targeting the correct answer (0 to 3)
  correctAnswerIndex: { type: Number, required: true, min: 0, max: 3 }
});

const quizSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    // 🌐 CHANGED: Removed unique: true to allow multiple quizzes per module/section frame
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true, index: true }, 
    title: { type: String, required: true },
    // ⏱️ Admin Configuration for the countdown timer
    durationInMinutes: { type: Number, required: true, default: 15 }, 
    questions: [questionSchema],
    // 📂 Optional: Sort order weight value for managing positions relative to lecture nodes
    order: { type: Number, default: 0 }
  }, 
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);