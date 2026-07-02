import Review from "../models/Review.js";
import Course from "../models/Course.js";

/**
 * UTILITY ENGINE: Recompute course rating aggregates on data modifications
 */
const recalculateCourseRating = async (courseId) => {
  const statistics = await Review.aggregate([
    { $match: { courseId: courseId } },
    {
      $group: {
        _id: "$courseId",
        averageScore: { $avg: "$rating" },
        totalReviewsCount: { $sum: 1 }
      }
    }
  ]);

  if (statistics.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Number(statistics[0].averageScore.toFixed(1)),
      totalReviews: statistics[0].totalReviewsCount
    });
  } else {
    // Default fallback structural values if all reviews are completely deleted
    await Course.findByIdAndUpdate(courseId, { averageRating: 0, totalReviews: 0 });
  }
};

/**
 * 1. UPSERT COURSE REVIEW
 * Submits a new review or automatically updates an existing one for a course.
 * POST /api/v1/reviews/:courseId
 */
export const upsertCourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment, isFeaturedTestimonial } = req.body;
    const userId = req.userId;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating score metrics and descriptive commentary texts are required." });
    }

    const numericalRating = Number(rating);
    if (numericalRating < 1 || numericalRating > 5) {
      return res.status(400).json({ success: false, message: "Rating metric boundaries must range safely between 1 and 5." });
    }

    // Prepare standard set payload parameters
    const updatePayload = {
      rating: numericalRating,
      comment: comment.trim()
    };

    // 🌟 NEW: Set the feature flag if explicitly supplied in the incoming request payload
    if (isFeaturedTestimonial !== undefined) {
      updatePayload.isFeaturedTestimonial = isFeaturedTestimonial === "true" || isFeaturedTestimonial === true;
    }

    const review = await Review.findOneAndUpdate(
      { courseId, studentId: userId },
      { $set: updatePayload },
      { new: true, upsert: true, runValidators: true }
    );

    await recalculateCourseRating(courseId);

    return res.status(200).json({
      success: true,
      message: "Your evaluation profile rating has been saved and compiled.",
      data: review
    });
  } catch (error) {
    console.error("Upsert Review Matrix Error:", error);
    return res.status(500).json({ success: false, message: "Failed to securely save rating profile indices." });
  }
};

/**
 * 2. GET PUBLIC REVIEWS FOR A SINGLE COURSE
 * Public storefront endpoint to read course reviews. No auth needed.
 * GET /api/v1/reviews/:courseId
 */
export const getCourseReviewsCatalog = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const activePage = Math.max(1, parseInt(page));
    const activeLimit = Math.max(1, parseInt(limit));
    const skipOffset = (activePage - 1) * activeLimit;

    const [reviews, totalCount] = await Promise.all([
      Review.find({ courseId })
        .populate("studentId", "fullName profile.picture") 
        .sort({ createdAt: -1 })
        .skip(skipOffset)
        .limit(activeLimit)
        .lean(),
      Review.countDocuments({ courseId })
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalReviews: totalCount,
        totalPages: Math.ceil(totalCount / activeLimit),
        currentPage: activePage
      },
      data: reviews
    });
  } catch (error) {
    console.error("Fetch Review Catalog Error:", error);
    return res.status(500).json({ success: false, message: "Failed to gather published evaluation profiles." });
  }
};

/**
 * 3. PURGE REVIEW BY USER
 * Removes a student's review and recalculates the metrics.
 * DELETE /api/v1/reviews/:courseId
 */
export const deleteMyReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const deletedResult = await Review.findOneAndDelete({ courseId, studentId: userId });
    if (!deletedResult) {
      return res.status(404).json({ success: false, message: "No custom target evaluation profile found to clean." });
    }

    await recalculateCourseRating(courseId);

    return res.status(200).json({
      success: true,
      message: "Your course review and star rating data has been completely removed."
    });
  } catch (error) {
    console.error("Delete Review Exception:", error);
    return res.status(500).json({ success: false, message: "Failed to execute structural review purging routines." });
  }
};