import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

/**
 * 1. CREATE BLOG (ADMIN ONLY - WITH REFACTOR FOR BLOCK SECTIONS & SEOS)
 * Path: POST /api/v1/blogs
 * Expects: multipart/form-data (via multer)
 */
export const createBlog = async (req, res) => {
  try {
    const { title, desc, tag, readTime, author, status, contentSections, seo } = req.body;

    // Strict Validation Gate
    if (!title?.trim() || !desc?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error: Title and short description summary strings are strictly required." 
      });
    }

    // Explicit unique slug collision verification check
    const computedSlug = title.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
    const slugExists = await Blog.findOne({ slug: computedSlug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: `Conflict Error: An article with a matching derived slug format ("${computedSlug}") already exists.`
      });
    }

    // 📸 Asynchronous Cloudinary Upload Buffer Stream Pipeline
    let uploadedImageUrl = null;
    if (req.file) {
      try {
        uploadedImageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "blog_covers", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(req.file.buffer);
        });
      } catch (uploadError) {
        console.error("Cloudinary Blog Cover Upload Failure:", uploadError);
        return res.status(500).json({ success: false, message: "Media storage server error processing image asset." });
      }
    }

    // Safely parse stringified structured arrays passing through multipart/form-data
    let parsedSections = [];
    if (contentSections) {
      try {
        parsedSections = typeof contentSections === "string" ? JSON.parse(contentSections) : contentSections;
      } catch (e) {
        return res.status(400).json({ success: false, message: "Malformatted JSON layout schema provided for contentSections." });
      }
    }

    let parsedSeo = {};
    if (seo) {
      try {
        parsedSeo = typeof seo === "string" ? JSON.parse(seo) : seo;
      } catch (e) {
        return res.status(400).json({ success: false, message: "Malformatted JSON schema provided for SEO metrics." });
      }
    }

    const newPost = new Blog({
      title: title.trim(),
      desc: desc.trim(),
      tag: tag || "AI Technology",
      readTime: readTime || "5 Min",
      author: author || "Admin Panel Master",
      status: status || "DRAFT",
      image: uploadedImageUrl,
      contentSections: parsedSections,
      seo: parsedSeo
    });

    await newPost.save();
    return res.status(201).json({ 
      success: true, 
      message: "Blog layout components and indexing profiles deployed successfully.", 
      article: newPost 
    });

  } catch (error) {
    console.error("Critical Blog Creation Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error tracking post initialization." });
  }
};

/**
 * 2. UPDATE BLOG (ADMIN ONLY - STRUCTURAL BLOCK DEEP-MERGE ENHANCEMENTS)
 * Path: PUT /api/v1/blogs/:id
 * Expects: multipart/form-data (via multer)
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid hex identifier mapping format provided." });
    }

    const updateFields = { ...req.body };

    // Process structural component sections arrays out of form-data strings
    if (updateFields.contentSections && typeof updateFields.contentSections === "string") {
      try {
        updateFields.contentSections = JSON.parse(updateFields.contentSections);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Malformatted Content Layout structure array payload string." });
      }
    }

    // Parse stringified SEO blocks passed out of form-data fields
    if (updateFields.seo && typeof updateFields.seo === "string") {
      try {
        updateFields.seo = JSON.parse(updateFields.seo);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Malformatted JSON string provided inside SEO parameter block." });
      }
    }

    // Handle slug updates if a modification to the title is present
    if (updateFields.title) {
      updateFields.title = updateFields.title.trim();
      const newSlug = updateFields.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
      
      const slugCollision = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      if (slugCollision) {
        return res.status(400).json({
          success: false,
          message: `Update Aborted: Modifying this title causes a slug duplicate match collision with another article.`
        });
      }
      updateFields.slug = newSlug;
    }

    // 📸 Dynamic Media Upload Overwrite Execution Layer
    if (req.file) {
      try {
        const uploadedImageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "blog_covers", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        updateFields.image = uploadedImageUrl;
      } catch (uploadError) {
        console.error("Cloudinary Blog Cover Update Failure:", uploadError);
        return res.status(500).json({ success: false, message: "Media storage server error replacing image asset." });
      }
    }

    // 🔄 Deep merge SEO fields explicitly to prevent key wiping
    if (updateFields.seo && typeof updateFields.seo === "object") {
      for (const [key, value] of Object.entries(updateFields.seo)) {
        updateFields[`seo.${key}`] = value;
      }
      delete updateFields.seo;
    }

    const updatedPost = await Blog.findByIdAndUpdate(
      id, 
      { $set: updateFields }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ success: false, message: "Target article record index reference asset not found." });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Blog schema layers synchronized successfully.", 
      article: updatedPost 
    });

  } catch (error) {
    console.error("Critical Blog Update Exception Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error refining blog structures." });
  }
};

/**
 * 3. DELETE BLOG (ADMIN ONLY)
 * Path: DELETE /api/v1/blogs/:id
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid hex identifier mapping format provided." });
    }

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Target article asset reference index not found." });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Blog post successfully purged from registry." 
    });

  } catch (error) {
    console.error("Critical Blog Deletion System Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error removing target elements." });
  }
};

/**
 * 4. RETRIEVE ALL BLOGS (PUBLIC CARD SEED FEED WITH METADATA CACHE PIPELINE)
 * Path: GET /api/v1/blogs
 */
export const getAllBlogs = async (req, res) => {
  try {
    const queryCondition = req.query.isAdmin === "true" ? {} : { status: "PUBLISHED" };
    
    // Bypasses content arrays to lighten network transfer payload overhead for main grid views
    const posts = await Blog.find(queryCondition)
      .select("title slug desc image author tag readTime views averageRating createdAt status")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ 
      success: true, 
      totalCount: posts.length, 
      articles: posts 
    });

  } catch (error) {
    console.error("Bulk Article Index Query Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Failed parsing platform article registries." });
  }
};

/**
 * 5. RETRIEVE SINGLE BLOG BY SLUG (PUBLIC READING PORTAL WITH AUTO-INCREMENT VIEW METRICS)
 * Path: GET /api/v1/blogs/:slug
 */
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const isAdminMode = req.query.isAdmin === "true";

    if (!slug?.trim()) {
      return res.status(400).json({ success: false, message: "Target route link parameter coordinate is required." });
    }

    // Increment view counts atomically inside the engine if a standard customer reads it
    const updatePipeline = isAdminMode ? {} : { $inc: { views: 1 } };
    
    const article = await Blog.findOneAndUpdate(
      { slug: slug.trim().toLowerCase() },
      updatePipeline,
      { returnDocument: 'after' } // ❌ Replaced { new: true } to eliminate the deprecation warning
    );

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "The requested article link parameters could not match a record in our system registry." 
      });
    }

    if (article.status === "DRAFT" && !isAdminMode) {
      return res.status(403).json({ success: false, message: "Access Restricted: This document timeline is a pending draft." });
    }

    return res.status(200).json({ success: true, article });

  } catch (error) {
    console.error("Single Post Resolution Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error resolving article details." });
  }
};

/**
 * 6. SUBMIT COMMUNITY PEER EVALUATION RATING (AUTHENTICATED USER LOCK PORTAL)
 * Path: POST /api/v1/blogs/:id/reviews
 */
export const addBlogReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment?.trim()) {
      return res.status(400).json({ success: false, message: "Review criteria error: Rating score and text evaluation comment are required." });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Target document could not be matched for tracking." });
    }

    // Enforce tracking restrictions — block repetitive evaluation submissions from the same credentials
    const alreadyReviewed = blog.reviews.find(
      (rev) => rev.userId.toString() === req.user.id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "Security Block: You have already filed a structural peer evaluation for this publication." });
    }

    const newReview = {
      userId: req.user.id,
      userName: req.user.name || "Verified Professional",
      rating: Number(rating),
      comment: comment.trim()
    };

    blog.reviews.push(newReview);
    
    // Recalculate mathematical global rolling score metrics
    const overallSum = blog.reviews.reduce((acc, item) => item.rating + acc, 0);
    blog.averageRating = overallSum / blog.reviews.length;

    await blog.save();
    return res.status(201).json({ success: true, message: "Peer review data block logged and averaged successfully.", reviews: blog.reviews });

  } catch (error) {
    console.error("Review Injection Fatal Exception:", error);
    return res.status(500).json({ success: false, message: "Internal server engine error updating review schema nodes." });
  }
};