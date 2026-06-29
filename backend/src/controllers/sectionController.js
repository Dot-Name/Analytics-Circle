// controllers/sectionController.js
import Section from "../models/Section.js";
import Course from "../models/Course.js";
import Lecture from "../models/Lecture.js"; // Added import for cascade drop dependency
import Quiz from "../models/Quiz.js";       // Added import for cascade drop dependency

/**
 * CREATE: Append a section to an existing course (Admin Only)
 */
export const createSection = async (req, res) => {
    try {
        const { title, courseId, description } = req.body;

        if (!title || !courseId) {
            return res.status(400).json({ 
                success: false, 
                message: "Required fields missing: title and courseId are mandatory." 
            });
        }

        const parentCourse = await Course.findById(courseId);
        if (!parentCourse) {
            return res.status(404).json({ success: false, message: "Associated course not found." });
        }

        // Fix count logic to match field 'course' mapping
        const sectionCount = await Section.countDocuments({ course: courseId });
        
        const section = await Section.create({
            title,
            description: description || "",
            course: courseId, 
            order: sectionCount + 1,
            isPublished: true 
        });

        await Course.findByIdAndUpdate(courseId, { 
            $inc: { totalSections: 1 } 
        });

        return res.status(201).json({ success: true, data: section });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * READ: Get all sections associated with a specific course (Handles BOTH query and params fallback!)
 */
export const getSectionsByCourse = async (req, res) => {
    try {
        // 💡 HYBRID FIX: Fallback check reads from route params OR incoming URL search queries (?courseId=...)
        const courseId = req.params.courseId || req.query.courseId;
        
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: courseId must be supplied via route parameters or search queries."
            });
        }

        // Query documents matching either potential schema definition identifier path
        const sections = await Section.find({
            $or: [
                { course: courseId },
                { courseId: courseId }
            ]
        })
        .sort({ order: 1 })
        .select("-__v");
        
        return res.status(200).json({ success: true, count: sections.length, data: sections });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * UPDATE: Modify section titles, metadata descriptions, or visibility statuses (Admin Only)
 */
export const updateSection = async (req, res) => {
    try {
        // 💡 Safeguard check: Handles both standard params variations
        const targetSectionId = req.params.id || req.params.sectionId;

        const updatedSection = await Section.findByIdAndUpdate(
            targetSectionId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedSection) {
            return res.status(404).json({ success: false, message: "Target section record does not exist." });
        }

        return res.status(200).json({ success: true, data: updatedSection });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * REORDER: Bulk-apply manual drag-and-drop structural row weights (Admin Only)
 */
export const reorderSections = async (req, res) => {
    try {
        const { courseId, orderedSectionIds } = req.body; 

        if (!courseId || !Array.isArray(orderedSectionIds)) {
            return res.status(400).json({ success: false, message: "Invalid payload layout structure." });
        }

        const bulkOps = orderedSectionIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id, course: courseId },
                update: { $set: { order: index + 1 } }
            }
        }));

        await Section.bulkWrite(bulkOps);

        return res.status(200).json({ success: true, message: "Course structural order re-indexed successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * DELETE: Permanently remove a section, cascade down to subordinate 
 * components (Lectures & Quizzes), and decrement course counters (Admin Only)
 */
export const deleteSection = async (req, res) => {
    try {
        const targetSectionId = req.params.id || req.params.sectionId;

        // 1. Locate the target section element first to gather its data references
        const section = await Section.findById(targetSectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: "Target section record does not exist." });
        }

        // 2. Concurrently purge all internal Lectures and Assessment Quizzes bound to this section ID
        await Promise.all([
            Lecture.deleteMany({ sectionId: targetSectionId }),
            Quiz.deleteMany({ sectionId: targetSectionId })
        ]);

        // 3. Drop the parent section container node itself
        await section.deleteOne();

        // 4. Decrement the structural tracking counter inside the assigned Course container
        if (section.course) {
            await Course.findByIdAndUpdate(section.course, { 
                $inc: { totalSections: -1 } 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Section along with all underlying lectures and quizzes completely purged." 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};