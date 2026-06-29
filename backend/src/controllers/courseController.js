import Course from "../models/Course.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary"; 
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js"; 
import Quiz from "../models/Quiz.js";       

// Initialize Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// 🛠️ UTILITY HELPERS
// ==========================================

// 🌟 ADDED: Safely extracts folder path + public_id from a Cloudinary secure URL
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        const parts = url.split("/");
        const uploadIndex = parts.indexOf("upload");
        if (uploadIndex === -1) return null;
        
        // Grabs everything after '/upload/vXXXXXX/' -> e.g. ['course_thumbnails', 'image_name.jpg']
        const fileParts = parts.slice(uploadIndex + 2); 
        const fullPublicId = fileParts.join("/");
        
        // Remove the file extension tracking segment (e.g., .jpg, .png) for standard image resource types
        return fullPublicId.replace(/\.[^/.]+$/, "");
    } catch (error) {
        console.error("Error parsing public ID from thumbnail URL:", error);
        return null;
    }
};


/**
 * 1. CREATE: Instantiate a new course track (Admin Only - With Image Upload)
 * Path: POST /api/v1/courses
 */
export const createCourse = async (req, res) => {
    try {
        const { 
            title, 
            slug, 
            subtitle, 
            description, 
            category, 
            subCategory, 
            level, 
            language, 
            price, 
            discountPrice,
            requirements,
            learningOutcomes,
            seo
        } = req.body;

        if (!title || !title.trim() || !slug || !description || !category || price === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "Validation Error: Missing parameters. Title, slug, description, category, and price are required." 
            });
        }

        const formattedSlug = slug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, "-");

        const slugCollision = await Course.findOne({ slug: formattedSlug });
        if (slugCollision) {
            return res.status(400).json({
                success: false,
                message: `Configuration Conflict: A course with the URL slug ("${formattedSlug}") already exists.`
            });
        }

        let uploadedThumbnailUrl = "";
        if (req.file) {
            try {
                uploadedThumbnailUrl = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "course_thumbnails", resource_type: "image" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
            } catch (uploadError) {
                console.error("Cloudinary Thumbnail Upload Failure:", uploadError);
                return res.status(500).json({ success: false, message: "Media storage server error processing thumbnail asset." });
            }
        }

        let parsedSeo = {};
        if (seo) {
            try {
                parsedSeo = typeof seo === "string" ? JSON.parse(seo) : seo;
            } catch (e) {
                return res.status(400).json({ success: false, message: "Malformatted JSON structure provided for SEO metrics." });
            }
        }

        const course = await Course.create({
            title: title.trim(),
            slug: formattedSlug,
            subtitle: subtitle ? subtitle.trim() : "",
            description: description.trim(),
            category: category.trim(),
            subCategory: subCategory ? subCategory.trim() : "",
            level: level || "BEGINNER",
            language: language || "English",
            price: Number(price),
            discountPrice: discountPrice ? Number(discountPrice) : 0,
            requirements: Array.isArray(requirements) ? requirements : [],
            learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
            thumbnail: uploadedThumbnailUrl, 
            instructor: req.userId, 
            status: "DRAFT",
            seo: parsedSeo
        });

        return res.status(201).json({ success: true, data: course });
    } catch (error) {
        console.error("Critical Course Creation Exception:", error);
        return res.status(500).json({ success: false, message: "Internal server error initializing course profile registries." });
    }
};

/**
 * 2. READ: Fetch active, published storefront choices (Public Display Feeds)
 */
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ 
            status: "PUBLISHED", 
            isDeleted: false 
        })
        .select("-__v")
        .sort({ createdAt: -1 })
        .lean(); 
        
        return res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        console.error("Course Catalog Query Failure:", error);
        return res.status(500).json({ success: false, message: "Internal server error parsing platform course registries." });
    }
};

/**
 * 3. READ: Fetch deep course data mapping profile via slug
 */
export const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug || !slug.trim()) {
            return res.status(400).json({ success: false, message: "Target lookup route parameter key is required." });
        }

        const course = await Course.findOne({ 
            slug: slug.trim().toLowerCase(), 
            isDeleted: false 
        })
        .select("-__v")
        .lean();
        
        if (!course) {
            return res.status(404).json({ success: false, message: "Course details profile could not be found." });
        }

        if (course.status === "DRAFT" && req.query.isAdmin !== "true") {
            return res.status(403).json({ success: false, message: "Access Restricted: This curriculum track is under development." });
        }

        return res.status(200).json({ success: true, data: course });
    } catch (error) {
        console.error("Single Course Slug Resolution Failure:", error);
        return res.status(500).json({ success: false, message: "Internal server error resolving target course metadata." });
    }
};

/**
 * 4. UPDATE: Modify targeted parameters with Thumbnail Overwrites & SEO Deep-Merging (Admin Only)
 */
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid hex modifier tracking coordinates provided." });
        }

        const updateFields = { ...req.body };

        if (updateFields.seo && typeof updateFields.seo === "string") {
            try {
                updateFields.seo = JSON.parse(updateFields.seo);
            } catch (e) {
                return res.status(400).json({ success: false, message: "Malformatted JSON string provided inside SEO parameter block." });
            }
        }

        if (updateFields.slug) {
            updateFields.slug = updateFields.slug
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, "")
                .replace(/\s+/g, "-");

            const slugCollision = await Course.findOne({ slug: updateFields.slug, _id: { $ne: courseId } });
            if (slugCollision) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Update Aborted: This structural slug changes map directly onto another live course." 
                });
            }
        }

        if (req.file) {
            try {
                const uploadedThumbnailUrl = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "course_thumbnails", resource_type: "image" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
                updateFields.thumbnail = uploadedThumbnailUrl; 
            } catch (uploadError) {
                console.error("Cloudinary Course Thumbnail Update Failure:", uploadError);
                return res.status(500).json({ success: false, message: "Media storage server error replacing thumbnail asset." });
            }
        }

        if (updateFields.seo && typeof updateFields.seo === "object") {
            for (const [key, value] of Object.entries(updateFields.seo)) {
                updateFields[`seo.${key}`] = value;
            }
            delete updateFields.seo; 
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateFields },
            { returnDocument: 'after', runValidators: true } 
        );

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Target course record does not exist across active index registers." });
        }

        return res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
        console.error("Critical Course Parameters Synchronization Exception:", error);
        return res.status(500).json({ success: false, message: "Internal server error running layout adjustments." });
    }
};

/**
 * 5. DELETE: Permanent hard delete execution profile with complete cascade drop (Admin Only)
 * Path: DELETE /api/v1/courses/:courseId
 */
export const softDeleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid hex modifier tracking coordinates provided." });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Target course record does not exist across registry fields." });
        }

        // 📸 🛠️ ADDED: Cloudinary Thumbnail Media Purge Layer
        if (course.thumbnail) {
            const thumbnailPublicId = getPublicIdFromUrl(course.thumbnail);
            if (thumbnailPublicId) {
                console.log(`Purging course thumbnail out of Cloudinary: ${thumbnailPublicId}`);
                // Images drop instantly without standard raw type settings flags
                await cloudinary.uploader.destroy(thumbnailPublicId);
            }
        }

        // Collect intermediate system keys (Sections) to access deepest nodes
        const sections = await Section.find({
            $or: [
                { courseId: courseId },
                { course: courseId }
            ]
        }).select("_id");
        
        const sectionIds = sections.map(sec => sec._id);

        // Parallelized Deep Cascade Eradication Sweep Routine
        await Promise.all([
            Lecture.deleteMany({ sectionId: { $in: sectionIds } }),
            Quiz.deleteMany({ sectionId: { $in: sectionIds } }),
            Section.deleteMany({
                $or: [
                    { courseId: courseId },
                    { course: courseId }
                ]
            })
        ]);

        // Expunge the primary course root layout entry document
        await course.deleteOne();

        return res.status(200).json({ 
            success: true, 
            message: "Course ecosystem along with thumbnail image, sub-sections, lectures, and quizzes successfully purged from the system database." 
        });
    } catch (error) {
        console.error("Course Structural Cascade Deletion Failure:", error);
        return res.status(500).json({ success: false, message: "Internal server error running layout wipe execution cascade." });
    }
};

/**
 * 6. PATCH: Toggle operational state loops between visibility tiers (Admin Only)
 */
export const togglePublishStatus = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid hex modifier tracking coordinates provided." });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Target course record could not be extracted." });
        }

        course.status = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        await course.save();

        return res.status(200).json({ 
            success: true, 
            message: `Visibility processing status successfully shifted to ${course.status}.`, 
            status: course.status 
        });
    } catch (error) {
        console.error("Curriculum State Toggle Exception:", error);
        return res.status(500).json({ success: false, message: "Internal server error toggling state parameters." });
    }
};

/**
 * READ: Fetch ALL courses including drafts/archives for Admin Workspace management
 */
export const getAdminAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isDeleted: false })
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean(); 

        const enrichedCourses = await Promise.all(
            courses.map(async (course) => {
                const relatedSections = await Section.find({ 
                    $or: [
                        { courseId: course._id },
                        { course: course._id }
                    ]
                })
                .sort({ order: 1 })
                .select("-__v")
                .lean();

                return {
                    ...course,
                    sections: relatedSections || [] 
                };
            })
        );
        
        return res.status(200).json({ 
            success: true, 
            count: enrichedCourses.length, 
            data: enrichedCourses 
        });
    } catch (error) {
        console.error("Admin Course Management Query Failure:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error parsing admin database registers." 
        });
    }
};