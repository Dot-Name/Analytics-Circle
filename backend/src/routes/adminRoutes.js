import express from "express";
import {
  adminCreateUser,
  adminToggleBlockUser,
  adminEnrollUserInCourse,
  adminGetAllUsers,
  adminDeleteUser,
  adminGetUserSubscriptions,
  adminUnsubscribeUserFromCourse,
  adminGetUserProgressDetails,
    adminUpdateUser
} from "../controllers/adminUserController.js";

const router = express.Router();

// Bulk User Fetch & Creation
router.route("/users")
  .get(adminGetAllUsers)
  .post(adminCreateUser);

// Profile Purging
router.route("/users/:id")
    .put(adminUpdateUser)
    .delete(adminDeleteUser);

// Block & Unblock Toggle Engine
router.route("/users/:id/toggle-status")
  .patch(adminToggleBlockUser);

// Core Manual Enrollment Operations
router.route("/users/:id/subscription")
  .get(adminGetUserSubscriptions)       // 👈 See all courses + dashboard progress percentages
  .post(adminEnrollUserInCourse)       // 👈 Subscribe user manually (No payment verification needed)
  .delete(adminUnsubscribeUserFromCourse); // 👈 Unsubscribe user manually

// Granular Lecture Watch Timestamps & Completion History
router.route("/users/:id/progress/:courseId")
  .get(adminGetUserProgressDetails);

export default router;