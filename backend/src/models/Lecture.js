import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  moduleName: { type: String, required: true, trim: true },
  youtubeId: { type: String, required: true, trim: true }, // The extracted 11-char ID
  duration: { type: Number, default: 0 },                  // Parsed to seconds for progress math
  zipResourceUrl: { type: String, default: null },
  isPreview: { type: Boolean, default: false },            // ✅ Added missing preview toggle status
  
  // ✅ Parent Course Reference Container
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true
  },
  // ✅ Parent Section Reference Container
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
    index: true
  }
}, { timestamps: true });

// Prevent overwrite errors during runtime reload steps
export default mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);