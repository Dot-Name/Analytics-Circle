import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Review must belong to a parent course shell link."],
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must be explicitly authored by a registered student."]
    },
    rating: {
      type: Number,
      required: [true, "Please provide a numeric score rating value."],
      min: [1, "Rating metric evaluation score must be at least 1 star."],
      max: [5, "Rating metric evaluation score cannot exceed 5 stars."]
    },
    comment: {
      type: String,
      required: [true, "Review comment text context parameters cannot be blank."],
      trim: true,
      maxlength: [1000, "Commentary text space parameters cannot exceed 1000 characters."]
    }
  },
  { timestamps: true }
);

// 🔒 COMPRESSION COMPOUND RULE: One unique student footprint submission profile allowed per course container index
reviewSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;