import mongoose from "mongoose";

/**
 * @description Embedded Document Schema representing individual content layout modules.
 * This structure empowers the React frontend to map custom components dynamically 
 * (e.g., Code Comparisons, Blockquotes, Callouts) without forcing strict markdown constraints.
 */
const contentSectionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["rich_text", "callout", "blockquote", "grid_cards", "comparison_blocks"], 
    required: [true, "Content section structural component variant type is required."] 
  },
  heading: { 
    type: String, 
    trim: true 
  },
  body: { 
    type: String 
  },
  calloutBox: {
    title: { type: String, trim: true },
    text: { type: String, trim: true }
  },
  blockquote: {
    quote: { type: String, trim: true },
    author: { type: String, default: "Anonymous", trim: true }
  },
  cards: [{
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true }
  }],
  comparisons: [{
    blockTitle: { type: String, trim: true },
    description: { type: String, trim: true },
    weak: { type: String, required: true },
    strong: { type: String, required: true }
  }]
});

/**
 * @description Document Schema for peer evaluations. 
 * Linked via standard multi-collection ObjectIDs to map users securely.
 */
const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "Authenticated User identification pointer reference required."] 
  },
  userName: { 
    type: String, 
    required: [true, "Reviewer screen name property string required."] 
  },
  rating: { 
    type: Number, 
    required: [true, "Numeric star scalar rating score integer required."], 
    min: [1, "Rating metric must be at minimum 1 star."], 
    max: [5, "Rating metric cannot exceed a maximum threshold of 5 stars."] 
  },
  comment: { 
    type: String, 
    required: [true, "Evaluation textual comment commentary string required."], 
    trim: true 
  }
}, { timestamps: true });

/**
 * @description Core Global Blog Post Engine Schema.
 */
const blogSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Article headline title string is required."], 
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    }, 
    desc: { 
      type: String, 
      required: [true, "Snippet abstract summary text description field required."], 
      trim: true 
    }, 
    image: { 
      type: String, 
      default: null 
    }, 
    author: { 
      type: String, 
      default: "Admin Panel Master",
      trim: true
    },
    status: { 
      type: String, 
      enum: ["DRAFT", "PUBLISHED"], 
      default: "DRAFT", 
      index: true 
    },
    views: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    tag: { 
      type: String, 
      default: "AI Technology",
      trim: true,
      index: true // Optimized for lightning-fast search filter lookups by category
    },
    readTime: { 
      type: String, 
      default: "5 Min",
      trim: true 
    },
    
    // Core Layout Section Assembly Matrix
    contentSections: [contentSectionSchema],
    
    // User Engagement & Ratings Array Tracks
    reviews: [reviewSchema],
    averageRating: { 
      type: Number, 
      default: 5.0,
      min: 0,
      max: 5
    },

    // Embedded SEO Architecture Metadata Object
    seo: {
      metaTitle: { 
        type: String, 
        trim: true, 
        maxLength: [60, "Meta title tags should remain below 60 characters for search snippet previews."] 
      }, 
      metaDescription: { 
        type: String, 
        trim: true, 
        maxLength: [160, "Meta descriptions should stay under 160 characters to avoid search viewport clipping."] 
      }, 
      keywords: [{ 
        type: String,
        trim: true
      }], 
      focusKeyword: { 
        type: String,
        trim: true 
      }
    }
  },
  { 
    timestamps: true,
    // Forces conversion to native JS objects when transferring data to JSON api streams
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * 🛠️ MIDDLEWARE LIFECYCLE HOOK: Pre-Validation Sanitization
 * Automatically updates slugs before validation constraints execute.
 * Uses synchronous context execution mapping standard for modern Mongoose releases.
 */
blogSchema.pre("validate", function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "") // Drop alphanumeric discrepancies
      .replace(/\s+/g, "-");       // Swap spacing gaps for clean routing dashes
  }
});

export default mongoose.model("Blog", blogSchema);