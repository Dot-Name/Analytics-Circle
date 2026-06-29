import User from "../models/User.js";
import bcrypt from "bcrypt";
import StudentProgress from "../models/StudentProgress.js";

// ==========================================
// 1. CREATE USER + MANUAL ENROLLMENT BY ADMIN
// ==========================================
export const adminCreateUser = async (req, res) => {
  try {
    const { fullName, email, phone, age, password, role, targetCourseId, customExpiryDays, profile } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is a mandatory field." });
    }

    // Check if user account already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "A user account with this email already exists." });
    }

    // Set up password hashing if an admin typed one, otherwise fallback to empty secure string
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Construct the initialization payload, passing optional profile payloads safely
    const newUserData = {
      fullName,
      email: email.toLowerCase(),
      phone,
      age: age ? Number(age) : null,
      password: hashedPassword,
      role: role || "STUDENT",
      isVerified: true, // Admin-created accounts bypass standard OTP verification flows
      status: "ACTIVE",
      enrolledCourses: [],
      profile: profile || {}, // Allows initialization of profile subdocuments
      authProviders: { password: !!password, otp: false, google: false }
    };

    // If the admin wants to enroll them into a course immediately during creation
    if (targetCourseId) {
      const enrolledAt = new Date();
      const daysToLive = Number(customExpiryDays) || 365;
      const expiresAt = new Date(enrolledAt.getTime() + daysToLive * 24 * 60 * 60 * 1000);

      newUserData.enrolledCourses.push({
        courseId: targetCourseId,
        enrolledAt,
        expiresAt
      });
    }

    const createdUser = await User.create(newUserData);
    
    // Wipe sensitive fields before outputting response
    if (createdUser.password) createdUser.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User account created and configured successfully by Admin.",
      data: createdUser
    });

  } catch (error) {
    console.error("Admin Create User Exception:", error);
    return res.status(500).json({ success: false, message: "Internal server error creating user profile." });
  }
};

// ==========================================
// 2. TOGGLE USER ACCOUNT STATUS (BLOCK/UNBLOCK)
// ==========================================
export const adminToggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expects "ACTIVE" or "BLOCKED"

    if (!["ACTIVE", "BLOCKED"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payload status parameter. Value must be either 'ACTIVE' or 'BLOCKED'." 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Target user profile not found." });
    }

    const messageString = status === "BLOCKED" 
      ? "User has been blocked. All ongoing course tracking subscriptions are instantly frozen."
      : "User has been unblocked. Granted course entitlements are restored.";

    return res.status(200).json({
      success: true,
      message: messageString,
      data: updatedUser
    });

  } catch (error) {
    console.error("Admin Toggle Status Exception:", error);
    return res.status(500).json({ success: false, message: "Internal server error altering account state." });
  }
};

// ==========================================
// 3. MANUAL ENROLLMENT OVERRIDE FOR EXISTING USERS
// ==========================================
export const adminEnrollUserInCourse = async (req, res) => {
  try {
    const { id } = req.params; // Student User ID
    const { courseId, customExpiryDays } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Missing required courseId parameter." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Target student profile record not found." });
    }

    // Check if student is already enrolled in this exact course
    const alreadyEnrolledIndex = user.enrolledCourses.findIndex(
      (item) => item.courseId.toString() === courseId.toString()
    );

    const enrolledAt = new Date();
    const daysToLive = Number(customExpiryDays) || 365;
    const expiresAt = new Date(enrolledAt.getTime() + daysToLive * 24 * 60 * 60 * 1000);

    if (alreadyEnrolledIndex !== -1) {
      // 💡 Admin Override Power: If already enrolled, update/extend their access window timeline
      user.enrolledCourses[alreadyEnrolledIndex].expiresAt = expiresAt;
      user.enrolledCourses[alreadyEnrolledIndex].enrolledAt = enrolledAt;
    } else {
      // Create new clean subscription tracker item mapping block
      user.enrolledCourses.push({ courseId, enrolledAt, expiresAt });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Successfully updated manual enrollment permissions. Access expires in ${daysToLive} days.`,
      data: { enrolledCourses: user.enrolledCourses }
    });

  } catch (error) {
    console.error("Admin Manual Enrollment Exception:", error);
    return res.status(500).json({ success: false, message: "Internal server error executing enrollment overwrite." });
  }
};

// =========================================================
// 4. READ ALL USERS (WITH ADVANCED REGEX PROFILE FILTERING)
// =========================================================
export const adminGetAllUsers = async (req, res) => {
  try {
    // 🌐 Enhanced to support deep-query filtering by geographical profiles
    const { role, status, city, country } = req.query;
    let queryFilters = {};

    if (role) queryFilters.role = role;
    if (status) queryFilters.status = status;
    
    // Fuzzy matching for geographic administration sweeps
    if (city) queryFilters["profile.location.city"] = new RegExp(city.trim(), "i");
    if (country) queryFilters["profile.location.country"] = new RegExp(country.trim(), "i");

    // Automatically pulls down full profile subdocuments along with core registries
    const users = await User.find(queryFilters).select("-password -__v").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Admin Fetch Users Exception:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve student roster catalogue." });
  }
};

// ==========================================
// 5. PURGE USER COMPLETELY (DELETE)
// ==========================================
export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User record not found." });
    }

    return res.status(200).json({
      success: true,
      message: "User profile record and all associated internal nested attributes completely purged from database system cluster."
    });
  } catch (error) {
    console.error("Admin Delete User Exception:", error);
    return res.status(500).json({ success: false, message: "Failed to remove user account profile execution matrix." });
  }
};

// =========================================================
// 6. VIEW USER'S ENROLLED COURSES WITH CACHED AGGREGATES
// =========================================================
export const adminGetUserSubscriptions = async (req, res) => {
  try {
    const { id } = req.params; // Student User ID

    // Populate course details directly from your Course collection
    const user = await User.findById(id)
      .select("fullName email enrolledCourses")
      .populate("enrolledCourses.courseId", "title category price status");

    if (!user) {
      return res.status(404).json({ success: false, message: "Target student profile record not found." });
    }

    // Fetch the active progress aggregates across those courses for a comprehensive dashboard look
    const progressProfiles = await StudentProgress.find({ studentId: id })
      .select("courseId aggregates");

    // Map together the enrollment timeline details with the live calculated percentages
    const subscriptionsWithProgress = user.enrolledCourses.map((enrollment) => {
      const match = progressProfiles.find(
        (p) => p.courseId.toString() === enrollment.courseId?._id?.toString()
      );
      
      return {
        courseDetails: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt,
        expiresAt: enrollment.expiresAt,
        isExpired: new Date() > new Date(enrollment.expiresAt),
        progressOverview: match ? match.aggregates : { overallCompletionPercentage: 0, totalElementsCompleted: 0 }
      };
    });

    return res.status(200).json({
      success: true,
      student: { _id: user._id, fullName: user.fullName, email: user.email },
      count: subscriptionsWithProgress.length,
      subscriptions: subscriptionsWithProgress
    });

  } catch (error) {
    console.error("Admin Get Subscriptions Exception:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve student subscription portfolio." });
  }
};

// =========================================================
// 7. MANUALLY UNSUBSCRIBE / REVOKE COURSE ACCESS BY ADMIN
// =========================================================
export const adminUnsubscribeUserFromCourse = async (req, res) => {
  try {
    const { id } = req.params; // Student User ID
    const courseId = req.body?.courseId || req.query.courseId;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Missing required courseId parameters." });
    }

    // Pull the targeted course object cleanly out of the array
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { enrolledCourses: { courseId: courseId } } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Target student profile not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Course enrollment access revoked successfully by Admin. No refund pipelines triggered.",
      data: { enrolledCourses: updatedUser.enrolledCourses }
    });

  } catch (error) {
    console.error("Admin Unsubscribe Exception:", error);
    return res.status(500).json({ success: false, message: "Internal server error terminating course access." });
  }
};

// =========================================================
// 8. VIEW DEEP ITEMIZIED STUDENT PROGRESS LOGS
// =========================================================
export const adminGetUserProgressDetails = async (req, res) => {
  try {
    const { id, courseId } = req.params; // Student ID and Course ID

    const progressLedger = await StudentProgress.findOne({ studentId: id, courseId })
      .populate("completedLectures", "title duration moduleName")
      .populate("watchHistory.lectureId", "title duration");

    if (!progressLedger) {
      return res.status(200).json({
        success: true,
        message: "No localized tracking history ledger found for this user in this course.",
        data: {
          aggregates: { overallCompletionPercentage: 0, totalElementsCompleted: 0, totalCourseElements: 0 },
          completedLectures: [],
          watchHistory: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Detailed itemized progress ledger pulled successfully.",
      data: progressLedger
    });

  } catch (error) {
    console.error("Admin Progress Fetch Exception:", error);
    return res.status(500).json({ success: false, message: "Failed to gather itemized video playback tracking matrices." });
  }
};

// ====================================================================
// 9. MASTER PROFILE UPDATE & SUBSCRIPTION MANAGEMENT WITH FLATTENING
// ====================================================================
export const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params; // The Student's User ID
    const { fullName, email, phone, age, role, status, newCourseId, customExpiryDays, profile } = req.body;

    // 1. Fetch the target user profile record
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Target student profile record not found." });
    }

    // 2. Safely patch basic field parameters dynamically if provided in the body payload
    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (age !== undefined) user.age = age ? Number(age) : null;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;

    // 3. Handle Email normalization modifications carefully to prevent unique indexing collisions
    if (email && email.toLowerCase() !== user.email) {
      const emailCollisionCheck = await User.findOne({ email: email.toLowerCase() });
      if (emailCollisionCheck) {
        return res.status(400).json({ 
          success: false, 
          message: "Conflict: Another user account is already using that email address." 
        });
      }
      user.email = email.toLowerCase();
    }

    // 4. 🔄 PROTECTED PROFILE DEEP MERGER: Safe path modifications avoiding object erasure
    if (profile && typeof profile === "object") {
      if (profile.bio !== undefined) user.set("profile.bio", profile.bio.trim());
      if (profile.headline !== undefined) user.set("profile.headline", profile.headline.trim());

      // Flatten nested location mapping layers
      if (profile.location && typeof profile.location === "object") {
        if (profile.location.city !== undefined) user.set("profile.location.city", profile.location.city.trim());
        if (profile.location.country !== undefined) user.set("profile.location.country", profile.location.country.trim());
      }

      // Flatten dynamic socials link maps safely
      if (profile.socials && typeof profile.socials === "object") {
        for (const [key, value] of Object.entries(profile.socials)) {
          user.set(`profile.socials.${key}`, value.trim());
        }
      }
    }

    // 5. Handle Live Course Subscription Inject Engine
    if (newCourseId) {
      // Check if student is already explicitly enrolled inside this course matrix container
      const alreadyEnrolled = user.enrolledCourses.some(
        (item) => item.courseId.toString() === newCourseId.toString()
      );

      if (alreadyEnrolled) {
        return res.status(400).json({ 
          success: false, 
          message: "Conflict: This user is already actively enrolled within the specified course profile." 
        });
      }

      // Compute timeline markers (Defaulting to 365 days / 1 year unless custom days are specified)
      const enrolledAt = new Date();
      const daysToLive = Number(customExpiryDays) || 365;
      const expiresAt = new Date(enrolledAt.getTime() + daysToLive * 24 * 60 * 60 * 1000);

      // Push clean tracking subscription ledger structure item row block
      user.enrolledCourses.push({
        courseId: newCourseId,
        enrolledAt,
        expiresAt
      });
    }

    // 6. Save changes and trigger validation schema checks
    const updatedUser = await user.save();
    
    // Deconstruct and hide internal hash keys
    if (updatedUser.password) updatedUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Student account metadata profiles and tracking matrices updated successfully.",
      data: updatedUser
    });

  } catch (error) {
    console.error("Admin Master Update User Exception:", error);
    return res.status(500).json({ success: false, message: "Internal server error executing account adjustments." });
  }
};