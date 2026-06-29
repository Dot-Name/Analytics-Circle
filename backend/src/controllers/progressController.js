import mongoose from "mongoose";
import StudentProgress from "../models/StudentProgress.js";
import Lecture from "../models/Lecture.js";
import { recalculateCourseAggregates } from "../utils/progressAggregator.js";

// ==========================================
// 🕹️ ACTION HANDLER: SYNC VIDEO PLAYBACK
// ==========================================
export const syncVideoProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureId, lastPosition, isComplete } = req.body;
    
    const verifiedStudentId = req.userId || (req.user && req.user.id);
    if (!verifiedStudentId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    // 1. Fetch progress context safely
    let progress = await StudentProgress.findOne({ studentId: verifiedStudentId, courseId });
    if (!progress) {
      progress = new StudentProgress({ studentId: verifiedStudentId, courseId });
    }

    const lectureIdStr = lectureId.toString();
    const alreadyLogged = progress.completedLectures.some(id => id.toString() === lectureIdStr);

    // 🌟 OPTIMIZATION LAYER: If already logged complete, return immediately!
    // This stops repeated recalculations and heavy log spamming instantly.
    if (alreadyLogged) {
      return res.status(200).json({
        success: true,
        message: "Telemetry synchronized (cached layer skip).",
        data: {
          isCompleted: true,
          courseOverview: progress.aggregates
        }
      });
    }

    // 2. Toggle completed logs tracking context if marked finished
    if (isComplete || !alreadyLogged) { 
      // Force it to save as complete when triggered
      if (!alreadyLogged) {
        progress.completedLectures.push(lectureId);
        progress.markModified("completedLectures");
      }
    }

    // 3. Track active playback timeline pointer nodes positioning
    const historyIndex = progress.watchHistory.findIndex(h => h.lectureId?.toString() === lectureIdStr);
    if (historyIndex === -1) {
      progress.watchHistory.push({ lectureId, lastPosition });
    } else {
      progress.watchHistory[historyIndex].lastPosition = lastPosition;
    }
    
    progress.markModified("watchHistory");
    await progress.save();

    // 4. Trigger structural calculation array loops safely
    const freshAggregates = await recalculateCourseAggregates(verifiedStudentId, courseId);

    return res.status(200).json({
      success: true,
      message: "Telemetry synchronization updated.",
      data: {
        isCompleted: true,
        courseOverview: freshAggregates
      }
    });

  } catch (err) {
    console.error("Playback sync issue:", err);
    return res.status(500).json({ success: false, message: "Internal server payload tracking fault." });
  }
};

// ==========================================
// 📊 READ HANDLER: DASHBOARD DATA LOADER
// ==========================================
export const getStudentDashboardOverview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const verifiedStudentId = req.userId || (req.user && req.user.id);

    if (!verifiedStudentId) {
      return res.status(401).json({ success: false, message: "Identity session unverified." });
    }

    const progress = await StudentProgress.findOne({ studentId: verifiedStudentId, courseId });

    if (!progress) {
      return res.status(200).json({
        success: true,
        dashboard: {
          completionPercentage: 0,
          totalCourseElements: 0,
          totalElementsCompleted: 0,
          completedLectures: [],
          completedQuizzes: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      dashboard: {
        completionPercentage: progress.aggregates?.overallCompletionPercentage || 0,
        totalCourseElements: progress.aggregates?.totalCourseElements || 0,
        totalElementsCompleted: progress.aggregates?.totalElementsCompleted || 0,
        completedLectures: progress.completedLectures || [],
        completedQuizzes: progress.completedQuizzes || []
      }
    });

  } catch (error) {
    console.error("Dashboard engine read exception:", error);
    return res.status(500).json({ success: false, message: "Internal server compilation fault." });
  }
};