import { v2 as cloudinary } from "cloudinary";
import Quiz from "../models/Quiz.js";
import StudentProgress from "../models/StudentProgress.js";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js"; 
import Course from "../models/Course.js"; 
import { recalculateCourseAggregates } from "../utils/progressAggregator.js";
import mongoose from "mongoose";

// Initialize Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to extract YouTube ID from raw URLs
const extractYoutubeId = (url) => {
  if (!url) return null;
  if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
    return url;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Safely extracts folder path + public_id from Cloudinary image secure URLs
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    
    const fileParts = parts.slice(uploadIndex + 2); 
    const fullPublicId = fileParts.join("/");
    return fullPublicId.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error parsing public ID from question asset URL:", error);
    return null;
  }
};

/* 1. ADMIN: Create or Update an Independent Quiz Node within a Section Module Path: POST /api/v1/quizzes */
export const createOrUpdateQuiz = async (req, res) => {
  try {
    await mongoose.connection.db.collection('quizzes').dropIndex('sectionId_1').catch(err => {
      console.log("Unique index rule already wiped or missing.");
    });

    const { quizId, courseId, sectionId, title, durationInMinutes, questionsData } = req.body;

    if (!courseId || !sectionId || !title || !questionsData) {
      return res.status(400).json({ success: false, message: "Missing metadata parameters." });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ success: false, message: "Cast Error: Provided tracking hashes are invalid." });
    }

    let parsedQuestions = typeof questionsData === "string" ? JSON.parse(questionsData) : questionsData;

    if (req.files && req.files.length > 0) {
      for (let index = 0; index < parsedQuestions.length; index++) {
        const targetKey = `question_image_${index}`;
        const targetFile = req.files.find(file => file.fieldname === targetKey);

        if (targetFile) {
          const uploadedUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "quiz_assets", resource_type: "image" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );
            uploadStream.end(targetFile.buffer);
          });
          
          parsedQuestions[index].questionImage = uploadedUrl;
        }
      }
    }

    let quiz;

    if (quizId && mongoose.Types.ObjectId.isValid(quizId)) {
      quiz = await Quiz.findByIdAndUpdate(
        quizId,
        { 
          $set: {
            title: title.trim(), 
            durationInMinutes: durationInMinutes ? Number(durationInMinutes) : 15, 
            questions: parsedQuestions 
          }
        },
        { new: true, runValidators: true }
      );

      if (!quiz) {
        return res.status(404).json({ success: false, message: "Target quiz structural document not found." });
      }
    } else {
      quiz = new Quiz({
        courseId: new mongoose.Types.ObjectId(courseId),
        sectionId: new mongoose.Types.ObjectId(sectionId),
        title: title.trim(),
        durationInMinutes: durationInMinutes ? Number(durationInMinutes) : 15,
        questions: parsedQuestions
      });
      await quiz.save();
    }

    return res.status(200).json({ 
      success: true, 
      message: "Quiz structure synchronized successfully.", 
      data: quiz 
    });
  } catch (error) {
    console.error("Quiz Sync Exception:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* 2. STUDENT: Fetch Quiz Metadata & Start Countdown Session */
export const startQuizAttempt = async (req, res) => {
  try {
    const { quizId, courseId } = req.body; 
    const verifiedStudentId = req.userId || (req.user && req.user.id);

    // 🌟 LOGS: Initial verification payload details
    // console.log("========== START ==========");
    // console.log("quizId:", quizId);
    // console.log("courseId:", courseId);

    if (!verifiedStudentId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Target quiz asset not found." });
    }

    const user = await User.findById(verifiedStudentId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User identity profile not found." });
    }

    const isEnrolled = user.enrolledCourses && user.enrolledCourses.some(
      (c) => c.courseId.toString() === courseId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: "You are not actively enrolled in this class track." });
    }

    let progress = await StudentProgress.findOne({ studentId: verifiedStudentId, courseId });
    if (!progress) {
      progress = new StudentProgress({ studentId: verifiedStudentId, courseId });
    }

    if (!progress.quizAttempts) {
      progress.quizAttempts = [];
    }

    // 🌟 LOGS: Log state mapping prior to mutation rules
    // console.log(
    //     "Before:",
    //     progress.quizAttempts.map(q => q.quizId.toString())
    // );

    const allocatedMinutes = quiz.durationInMinutes || 15;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + allocatedMinutes * 60 * 1000);

    let attemptRecord = progress.quizAttempts.find(a => a.quizId.toString() === quizId.toString());

    if (!attemptRecord) {
      attemptRecord = {
        quizId,
        attemptsCount: 1,
        bestPercentageScore: 0,
        activeAttempt: {
          isActive: true,
          startedAt,
          expiresAt
        }
      };
      progress.quizAttempts.push(attemptRecord);
    } else {
      if (attemptRecord.attemptsCount >= 2 && !attemptRecord.activeAttempt?.isActive) {
        return res.status(400).json({ 
          success: false, 
          message: "Access Denied: You have exhausted your maximum limit of 2 evaluation attempts for this quiz module." 
        });
      }

      if (!attemptRecord.activeAttempt?.isActive) {
        attemptRecord.attemptsCount += 1;
      }
      
      attemptRecord.activeAttempt = {
        isActive: true,
        startedAt,
        expiresAt
      };
    }
    
    progress.markModified("quizAttempts");
    
    // console.log("Before Save:");
    // console.log(JSON.stringify(progress, null, 2));
    
    await progress.save();
    
    const verify = await StudentProgress.findOne({
        studentId: verifiedStudentId,
        courseId
    });

    // console.log("After Save:");
    // console.log(JSON.stringify(verify, null, 2));

    // 🌟 LOGS: Log clean target maps after writing to collection
    // console.log(
    //     "After:",
    //     progress.quizAttempts.map(q => q.quizId.toString())
    // );

    const randomizedQuestionsWithoutKeys = quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      questionImage: q.questionImage || null,
      options: q.options
    }));

    return res.status(200).json({
      success: true,
      message: "Quiz session initialization started cleanly.",
      questions: randomizedQuestionsWithoutKeys,
      timerDetails: {
        durationInSeconds: allocatedMinutes * 60,
        expiresAt: expiresAt.toISOString()
      },
      data: attemptRecord
    });

  } catch (error) {
    console.error("Quiz Initialization Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error mounting quiz elements." });
  }
};

/* 3. STUDENT: Fetch Multiple Quiz Items Under a Given Section (Hides Answers) */
export const getQuizBySection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;

    if (!sectionId || !courseId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required context parameters: courseId and sectionId must both be supplied." 
      });
    }
    
    const quizzes = await Quiz.find({ 
      courseId: courseId,
      sectionId: sectionId 
    })
    .select("-questions.correctAnswerIndex") 
    .lean(); 

    return res.status(200).json({ 
      success: true, 
      count: quizzes.length,
      data: quizzes 
    });

  } catch (error) {
    console.error("Error inside getQuizBySection engine pipeline:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error resolving section assessment structures.",
      error: error.message 
    });
  }
};

/* 4. STUDENT: Submit Answers & Evaluate Results */
export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, courseId } = req.params;
    const { studentAnswers } = req.body; 

    const verifiedStudentId = req.userId || (req.user && req.user.id);
    if (!verifiedStudentId) {
      return res.status(401).json({ success: false, message: "Authentication Error: Unresolved tracking identity." });
    }

    let targetQuizId = quizId;
    let targetCourseId = courseId;

    let quiz = await Quiz.findById(targetQuizId);
    
    if (!quiz) {
      quiz = await Quiz.findById(courseId);
      if (quiz) {
        targetQuizId = courseId;
        targetCourseId = quizId;
      }
    }

    if (!quiz) {
      return res.status(400).json({ success: false, message: "Validation Error: Quiz target asset node not found with provided URL parameters." });
    }

    let progress = await StudentProgress.findOne({ studentId: verifiedStudentId, courseId: targetCourseId });
    if (!progress) {
      return res.status(400).json({ success: false, message: "Context Error: No active enrollment log tracked for this course." });
    }

    // 🌟 LOGS: Track resolution routing keys right before evaluating array lookups
    // console.log("========== SUBMIT ==========");
    // console.log("Submitting quiz:", targetQuizId);

    // console.log(
    //     "Stored attempts:",
    //     progress.quizAttempts.map(q => q.quizId.toString())
    // );

    const attemptRecord = progress.quizAttempts?.find(a => a.quizId.toString() === targetQuizId.toString());

    if (!attemptRecord) {
      return res.status(400).json({ 
        success: false, 
        message: "Context Error: Quiz session was not initialized via the start endpoint." 
      });
    }

    if (attemptRecord.attemptsCount > 2) {
      return res.status(400).json({
        success: false,
        message: "Access Denied: Maximum attempt threshold exceeded. Only 2 attempts are permitted."
      });
    }

    const currentTime = new Date();
    const expirationTime = attemptRecord.activeAttempt?.expiresAt 
      ? new Date(attemptRecord.activeAttempt.expiresAt)
      : new Date(new Date(attemptRecord.activeAttempt?.startedAt || currentTime).getTime() + (quiz.durationInMinutes || 15) * 60 * 1000);
      
    let forceTimeoutTriggered = currentTime > expirationTime;

    let pointsEarned = 0;
    const evaluationReport = [];
    const totalQuestionsCount = quiz.questions.length;

    quiz.questions.forEach((question, idx) => {
      const selectedOptionIndex = studentAnswers ? studentAnswers[idx] : undefined;
      const correctOptionIndex = question.correctAnswerIndex;
      
      const isCorrect = !forceTimeoutTriggered && 
                        selectedOptionIndex !== undefined && 
                        Number(selectedOptionIndex) === correctOptionIndex;

      if (isCorrect) pointsEarned++;

      evaluationReport.push({
        questionNumber: idx + 1,
        questionText: question.questionText,
        questionImage: question.questionImage || null,
        yourSelection: (selectedOptionIndex !== undefined && question.options[selectedOptionIndex]) 
          ? question.options[selectedOptionIndex] 
          : "Skipped / Auto-Submitted on Timeout",
        correctSelection: question.options[correctOptionIndex] || "N/A",
        isCorrect
      });
    });

    const calculatedPercentage = totalQuestionsCount > 0 
      ? Number(((pointsEarned / totalQuestionsCount) * 100).toFixed(1)) 
      : 0;

    if (calculatedPercentage > attemptRecord.bestPercentageScore) {
      attemptRecord.bestPercentageScore = calculatedPercentage;
    }

    if (!progress.completedQuizzes.some(id => id.toString() === targetQuizId.toString())) {
      progress.completedQuizzes.push(targetQuizId);
    }

    if (attemptRecord.activeAttempt) {
      attemptRecord.activeAttempt.isActive = false;
    }

    progress.markModified("quizAttempts");
    progress.markModified("completedQuizzes");
    await progress.save();

    const currentCourseAggregates = await recalculateCourseAggregates(verifiedStudentId, targetCourseId);

    return res.status(200).json({
      success: true,
      message: forceTimeoutTriggered 
        ? "Time expired! The quiz submission window was automatically processed and closed."
        : `Quiz evaluated successfully. Attempt ${attemptRecord.attemptsCount}/2 recorded.`,
      summary: {
        scoreAchieved: `${pointsEarned}/${totalQuestionsCount}`,
        attemptPercentage: `${calculatedPercentage}%`,
        bestPercentageToDate: `${attemptRecord.bestPercentageScore}%`,
        attemptsRemaining: Math.max(0, 2 - attemptRecord.attemptsCount)
      },
      certificateStatus: {
        currentRunningQuizAverage: `${currentCourseAggregates?.courseTotalQuizScorePercentage || 0}%`,
        unlockedCertificate: currentCourseAggregates?.isEligibleForCertificate || false,
        requirementsHint: "Requires 100% video progress completion mixed alongside a minimum score threshold of 65% across all quizzes."
      },
      detailedBreakdown: evaluationReport
    });

  } catch (error) {
    console.error("Quiz Evaluation Exception Engine Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error calculating quiz results." });
  }
};

/* 5. ADMIN ONLY: Fetch All Quiz Units matching a targeted structural Section Node */
export const getAdminQuizBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const quizzes = await Quiz.find({ sectionId });
    return res.status(200).json({ success: true, data: quizzes }); 
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* 6. ADMIN ONLY: Delete Quiz Node and media attachments */
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ success: false, message: "Invalid hex coordinate string supplied." });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Target quiz structural schema document not found." });
    }

    if (quiz.questions && quiz.questions.length > 0) {
      const deletionPromises = quiz.questions
        .filter(q => q.questionImage) 
        .map(async (q) => {
          const publicId = getPublicIdFromUrl(q.questionImage);
          if (publicId) {
            return cloudinary.uploader.destroy(publicId);
          }
        });
      await Promise.all(deletionPromises);
    }

    await quiz.deleteOne();
    return res.status(200).json({ 
      success: true, 
      message: "Quiz configuration block along with all media files completely cleared from cloud indexes." 
    });
  } catch (error) {
    console.error("Quiz Removal Core Execution Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error clearing requested quiz layout profiles." });
  }
};