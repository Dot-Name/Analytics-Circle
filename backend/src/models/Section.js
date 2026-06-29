import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      required: true,
      default: 1,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },

    totalDuration: {
      type: Number,
      default: 0, // seconds
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Fast sorting by section order
sectionSchema.index({
  course: 1,
  order: 1,
});

export default mongoose.model(
  "Section",
  sectionSchema
);