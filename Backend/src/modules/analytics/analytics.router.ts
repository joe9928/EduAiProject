import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../common/middleware/jwt.middleware";
import {
  getStudentAnalytics,
  getLecturerAnalytics,
} from "./analytics.controller";

const router = Router();

// Student views their own progress in a course
router.get(
  "/analytics/student/courses/:courseId",
  authenticate,
  authorize(Role.STUDENT),
  getStudentAnalytics,
);

// Lecturer views course-wide performance overview
router.get(
  "/analytics/lecturer/courses/:courseId",
  authenticate,
  authorize(Role.LECTURER),
  getLecturerAnalytics,
);

export default router;