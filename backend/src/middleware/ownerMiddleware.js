import Course from "../models/Course.js";
import Section from "../models/Section.js";

/**
 * Ensures the logged-in user is the explicit creator/instructor of the target course
 */
export const isCourseOwner = async (req, res, next) => {
    try {
        // Fallbacks to grab the ID dynamically from URL params or incoming JSON body
        const courseId = req.params.courseId || req.body.courseId;
        const userId = req.userId; // Provided straight from your authMiddleware

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        // Use Mongoose .equals() to compare ObjectIds safely with req.userId string/object
        if (!course.instructor.equals(userId)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You do not own this course."
            });
        }

        // Save a DB query later: attach the loaded course data directly to the request object
        req.course = course;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Ensures the logged-in user owns the parent course that this specific section belongs to
 */
export const isSectionOwner = async (req, res, next) => {
    try {
        const sectionId = req.params.sectionId || req.body.sectionId;
        const userId = req.userId; 

        if (!sectionId) {
            return res.status(400).json({ success: false, message: "Section ID is required." });
        }

        // Populate the course field to read the nested instructor field
        const section = await Section.findById(sectionId).populate("course");
        if (!section || !section.course) {
            return res.status(404).json({ success: false, message: "Section or associated Course not found." });
        }

        if (!section.course.instructor.equals(userId)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You do not own the parent course of this section."
            });
        }

        // Attach the section to the request object for downstream controllers
        req.section = section;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};