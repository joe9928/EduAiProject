import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../common/middleware/jwt.middleware";
import { validateQuery } from "../../common/middleware/validate.middleware";
import { riskFilterSchema } from "./risk.validation";
import {
  calculateCourseRisk,
  getCourseRiskProfiles,
  getStudentRiskProfile,
} from "./risk.controller";

const router = Router();

// Trigger risk calculation for all students in a course
router.post(
  "/risk/courses/:courseId/calculate",
  authenticate,
  authorize(Role.LECTURER),
  calculateCourseRisk,
);

// Get all risk profiles for a course (lecturer view)
router.get(
  "/risk/courses/:courseId",
  authenticate,
  authorize(Role.LECTURER),
  validateQuery(riskFilterSchema),
  getCourseRiskProfiles,
);

// Get one student's risk profile
router.get(
  "/risk/students/:studentId/courses/:courseId",
  authenticate,
  getStudentRiskProfile,
);

export default router;