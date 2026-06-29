import mongoose from "mongoose";

const StudentProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
      }
    ],
    completedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
      }
    ],
    watchHistory: [
      {
        lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
        lastPosition: { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    // 🌟 FIX: Added missing array schema definition to stop data drop on .save()
    quizAttempts: [
      {
        quizId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz",
          required: true
        },
        attemptsCount: {
          type: Number,
          default: 0
        },
        bestPercentageScore: {
          type: Number,
          default: 0
        },
        activeAttempt: {
          isActive: {
            type: Boolean,
            default: false
          },
          startedAt: {
            type: Date,
            default: Date.now
          },
          expiresAt: {
            type: Date
          }
        }
      }
    ],
    aggregates: {
      overallCompletionPercentage: { type: Number, default: 0 },
      totalElementsCompleted: { type: Number, default: 0 },
      totalCourseElements: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

// Prevent accidental dual collection compilation errors
export default mongoose.models.StudentProgress || mongoose.model("StudentProgress", StudentProgressSchema);