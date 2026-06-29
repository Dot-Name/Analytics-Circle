import User from "../models/User.js";
import StudentProgress from "../models/StudentProgress.js"; // 🌟 Import the correct model

/**
 * GET & UPDATE PROFILE DATA COMBINED WITH PROGRESS TRACKS
 * Path: GET & PUT /api/v1/users/profile
 */
export const updateProfileInfo = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing identity payload." });
    }

    const hasUpdates = Object.keys(req.body || {}).length > 0;

    // --- Action 1: Handle Fetching Profile Data ---
    if (!hasUpdates) {
      const currentUser = await User.findById(userId)
        .select("-password -__v")
        .populate({ path: "enrolledCourses.courseId", model: "Course" });

      if (!currentUser) {
        return res.status(404).json({ success: false, message: "User account record not found." });
      }

      // Convert Mongoose document to a plain object so we can append tracking metadata safely
      const userObj = currentUser.toObject();

      // 🌟 REVERSE LOOKUP INSTEAD OF POPULATE: Match and merge aggregates dynamically
      if (userObj.enrolledCourses && userObj.enrolledCourses.length > 0) {
        userObj.enrolledCourses = await Promise.all(
          userObj.enrolledCourses.map(async (enrollment) => {
            if (!enrollment.courseId?._id) return enrollment;
            
            const trackingDoc = await StudentProgress.findOne({
              studentId: userId,
              courseId: enrollment.courseId._id
            }).select("aggregates modules");

            return {
              ...enrollment,
              // Attach the payload fields expected by MyCourses.jsx
              progressPercentage: trackingDoc?.aggregates?.overallCompletionPercentage || 0,
              aggregates: trackingDoc?.aggregates || { overallCompletionPercentage: 0 }
            };
          })
        );
      }

      return res.status(200).json({
        success: true,
        message: "Profile parameters retrieved successfully.",
        data: userObj
      });
    }

    // --- Action 2: Handle Updating Profile Data ---
    const { fullName, phone, age, profile } = req.body;
    const updateFields = {};

    if (fullName) updateFields.fullName = fullName.trim();
    if (phone) updateFields.phone = phone.trim();
    if (age) updateFields.age = Number(age);

    if (profile && typeof profile === "object") {
      if (profile.bio !== undefined) updateFields["profile.bio"] = profile.bio.trim();
      if (profile.headline !== undefined) updateFields["profile.headline"] = profile.headline.trim();

      if (profile.location && typeof profile.location === "object") {
        if (profile.location.city !== undefined) updateFields["profile.location.city"] = profile.location.city.trim();
        if (profile.location.country !== undefined) updateFields["profile.location.country"] = profile.location.country.trim();
      }

      if (profile.socials && typeof profile.socials === "object") {
        for (const [key, value] of Object.entries(profile.socials)) {
          updateFields[`profile.socials.${key}`] = value ? value.trim() : "";
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: true } 
    )
      .select("-password -__v")
      .populate({ path: "enrolledCourses.courseId", model: "Course" });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User account record not found." });
    }

    const updatedUserObj = updatedUser.toObject();

    // 🌟 Repeat the lookup for the updated update return path
    if (updatedUserObj.enrolledCourses && updatedUserObj.enrolledCourses.length > 0) {
      updatedUserObj.enrolledCourses = await Promise.all(
        updatedUserObj.enrolledCourses.map(async (enrollment) => {
          if (!enrollment.courseId?._id) return enrollment;
          
          const trackingDoc = await StudentProgress.findOne({
            studentId: userId,
            courseId: enrollment.courseId._id
          }).select("aggregates modules");

          return {
            ...enrollment,
            progressPercentage: trackingDoc?.aggregates?.overallCompletionPercentage || 0,
            aggregates: trackingDoc?.aggregates || { overallCompletionPercentage: 0 }
          };
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Extended profile parameters synchronized cleanly.",
      data: updatedUserObj
    });

  } catch (error) {
    console.error("User Profile Tuning Exception Failure:", error);
    return res.status(500).json({ success: false, message: "Internal server error applying profile transformations." });
  }
};