import mongoose from "mongoose";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";
import Quiz from "../models/Quiz.js";
import StudentProgress from "../models/StudentProgress.js";

export const recalculateCourseAggregates = async (userId, courseId) => {
  try {
    // 1. Resolve sections via correct relational property key ("course")
    const liveSections = await Section.find({ course: courseId }).select("_id");
    const sectionIds = liveSections.map(s => s._id);

    // 2. Count absolute elements published in this syllabus course outline
    const totalLecturesCount = await Lecture.countDocuments({ sectionId: { $in: sectionIds } });
    const totalQuizzesCount = await Quiz.countDocuments({ sectionId: { $in: sectionIds } });
    const totalCourseElements = totalLecturesCount + totalQuizzesCount;

    // 3. Find or securely instantiate the standalone tracking progress file
    let progress = await StudentProgress.findOne({ studentId: userId, courseId });
    if (!progress) {
      progress = new StudentProgress({ studentId: userId, courseId });
    }

    // 4. Compute intersection of user completed items inside these section constraints
    const completedLecturesCount = await Lecture.countDocuments({
      _id: { $in: progress.completedLectures || [] },
      sectionId: { $in: sectionIds }
    });

    const completedQuizzesCount = await Quiz.countDocuments({
      _id: { $in: progress.completedQuizzes || [] },
      sectionId: { $in: sectionIds }
    });

    const totalElementsCompleted = completedLecturesCount + completedQuizzesCount;

    // 5. Build strict mathematical evaluation scaling percentage
    const overallCompletionPercentage = totalCourseElements > 0 
      ? Math.min(100, Math.round((totalElementsCompleted / totalCourseElements) * 100)) 
      : 0;

    // 6. Write straight into the separate document schema configuration block
    progress.aggregates = {
      overallCompletionPercentage,
      totalElementsCompleted,
      totalCourseElements
    };

    progress.markModified("aggregates");
    await progress.save();

    // 📊 SYSTEM CONSOLE OUTPUT DIAGNOSTICS
    console.log("=== COURSE PROGRESS AGGREGATION LOGS ===");
    console.log("Course ID:", courseId);
    console.log("Sections Found Count:", liveSections.length);
    console.log("Lectures Total / Completed:", `${totalLecturesCount} / ${completedLecturesCount}`);
    console.log("Quizzes Total / Completed:", `${totalQuizzesCount} / ${completedQuizzesCount}`);
    console.log("Total Progress Score:", `${totalElementsCompleted} / ${totalCourseElements} Elements (${overallCompletionPercentage}%)`);
    console.log("========================================");

    return progress.aggregates;

  } catch (error) {
    console.error("[Telemetry Engine Failure] Error during dynamic recalculation:", error);
    return null;
  }
};