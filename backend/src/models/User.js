import mongoose from "mongoose";

// Sub-schema to hold detailed subscription metadata and dynamic metrics for a course
const courseEnrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(this.enrolledAt.getTime() + 365 * 24 * 60 * 60 * 1000);
    }
  },
  
  // =================================================================
  // 📈 🔍 ADDED THIS ACCURATE AGGREGATES SCHEMA PORT
  // =================================================================
  aggregates: {
    overallCompletionPercentage: { type: Number, default: 0 },
    totalElementsCompleted: { type: Number, default: 0 },
    totalCourseElements: { type: Number, default: 0 },
    courseTotalQuizScorePercentage: { type: Number, default: 0 },
    isEligibleForCertificate: { type: Boolean, default: false }
  }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, default: null },
    age: { type: Number, default: null },
    password: { type: String, default: null },
    googleId: { type: String, default: null },
    profilePicture: { type: String, default: null },
    role: { type: String, enum: ["STUDENT", "ADMIN"], default: "STUDENT" },
    status: { type: String, enum: ["ACTIVE", "BLOCKED"], default: "ACTIVE", index: true },
    isVerified: { type: Boolean, default: false },
    enrolledCourses: [courseEnrollmentSchema],

    // ==========================================
    // 🌐 EXTENDED PROFILE & SOCIAL MEDIA LAYER
    // ==========================================
    profile: {
      bio: { type: String, default: "", maxlength: 500 },
      headline: { type: String, default: "" },
      
      location: {
        city: { type: String, trim: true, default: "" },
        country: { type: String, trim: true, default: "" },
      },

      socials: {
        linkedin: { type: String, trim: true, default: "" },
        github: { type: String, trim: true, default: "" },
        twitter: { type: String, trim: true, default: "" },
        website: { type: String, trim: true, default: "" }
      }
    },

    authProviders: {
      password: { type: Boolean, default: false },
      otp: { type: Boolean, default: false },
      google: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Fallback protection check to prevent re-compilation over existing mongoose instances
export default mongoose.models.User || mongoose.model("User", userSchema);