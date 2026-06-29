import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, required: true, unique: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    courseTitle: { type: String, required: true },
    finalQuizAverage: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);