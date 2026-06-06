import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../../common/middleware/jwt.middleware";
import { validate, validateQuery } from "../../common/middleware/validate.middleware";
import {
  createAssignmentSchema,
  submitAssignmentSchema,
  gradeSubmissionSchema,
  assignmentFilterSchema,
  submissionFilterSchema,
} from "./assignment.validation";
import {
  createAssignment,
  getAssignmentsByCourse,
  getAssignment,
  submitAssignment,
  getMySubmission,
  gradeSubmission,
  getSubmissions,
} from "./assignment.controller";

const router = Router();

// ─── Assignment CRUD ─────────────────────────────────────────────────────────
router.post(
  "/courses/:courseId/assignments",
  authenticate,
  authorize(Role.LECTURER),
  validate(createAssignmentSchema),
  createAssignment,
);

router.get(
  "/courses/:courseId/assignments",
  authenticate,
  validateQuery(assignmentFilterSchema),
  getAssignmentsByCourse,
);

router.get(
  "/assignments/:id",
  authenticate,
  getAssignment,
);

// ─── Submission routes ────────────────────────────────────────────────────────
router.post(
  "/assignments/:id/submit",
  authenticate,
  authorize(Role.STUDENT),
  validate(submitAssignmentSchema),
  submitAssignment,
);

router.get(
  "/assignments/:id/submission",
  authenticate,
  authorize(Role.STUDENT),
  getMySubmission,
);

router.patch(
  "/submissions/:id/grade",
  authenticate,
  authorize(Role.LECTURER),
  validate(gradeSubmissionSchema),
  gradeSubmission,
);

router.get(
  "/assignments/:id/submissions",
  authenticate,
  authorize(Role.LECTURER),
  validateQuery(submissionFilterSchema),
  getSubmissions,
);

export default router;