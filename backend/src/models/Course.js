import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subtitle: { type: String, default: "", maxlength: 300 },
    description: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    category: { type: String, required: true },
    subCategory: { type: String, default: "" },
    level: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], default: "BEGINNER" },
    language: { type: String, default: "English" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    requirements: [{ type: String }],
    learningOutcomes: [{ type: String }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT" },
    totalSections: { type: Number, default: 0 },
    totalLectures: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 }, // seconds
    totalStudents: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    heroHighlights: {
    highlight1: { type: String, trim: true },
    highlight2: { type: String, trim: true }
    },
    careerRole: { type: String, trim: true },
    durationMonths: { type: Number, default: 0 },
    customDesc: { type: String },
    
    stats: [
      {
        value: { type: String },
        label: { type: String }
      }
    ],
    
    highlights: [
      {
        icon: { type: String },
        title: { type: String },
        desc: { type: String }
      }
    ],
    
    features: [
      {
        icon: { type: String },
        title: { type: String },
        desc: { type: String }
      }
    ],
    
    tools: [
      {
        name: { type: String },
        logo: { type: String }
      }
    ],
    
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    
    learningOptionsPrice: {
      classroom: { type: String },
      liveOnline: { type: String },
      selfPaced: { type: String }
    },
    
    batchStartsInDays: { type: Number },
    seatsLeft: { type: Number },
    // ==========================================
    // 🔍 THE EMBEDDED SEO & OPEN GRAPH LAYER
    // ==========================================
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 70 }, // Displays in search tab cuts
      metaDescription: { type: String, trim: true, maxlength: 160 }, // Search engine snippet summary text
      keywords: [{ type: String }], // Custom tag search parameters
      focusKeyword: { type: String }, // Target primary text phrase anchor
      
      // Open Graph Social Preview Media Optimization Configurations
      ogTitle: { type: String },
      ogDescription: { type: String },
      ogImage: { type: String } // Image card generated upon LinkedIn/Twitter sharing
    }
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text" });
// courseSchema.index({ slug: 1 }); // 👈 Performance booster for frontend reading pages

export default mongoose.model("Course", courseSchema);