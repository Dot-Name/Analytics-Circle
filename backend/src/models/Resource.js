import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String, // Tracks the R2 file location for clean background deletion
      required: true,
    },
    fileSize: {
      type: Number, // In bytes
    }
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);