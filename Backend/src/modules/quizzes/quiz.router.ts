import { Router } from "express";
import { authenticate, authorize } from "../../common/middleware/jwt.middleware";
import { validate, validateQuery } from "../../common/middleware/validate.middleware";
import { Role } from "@prisma/client";
import {
  createQuizSchema,
  quizFilterSchema,
  addQuestionSchema,
  submitAnswerSchema,
} from "./quiz.validation";
import {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  publishQuiz,
  addQuestion,
  startAttempt,
  saveAnswer,
  submitAttempt,
  getAttemptResult,
  generateQuiz,
} from "./quiz.controller";

const router = Router();

// ─── Quiz management (course-scoped) ──────────────────────────────────────
router.post(
  "/courses/:courseId/quizzes",
  authenticate,
  authorize(Role.LECTURER),
  validate(createQuizSchema),
  createQuiz,
);

router.get(
  "/courses/:courseId/quizzes",
  authenticate,
  validateQuery(quizFilterSchema),
  getQuizzesByCourse,
);

// ─── Quiz detail ───────────────────────────────────────────────────────────
router.get("/quizzes/:id", authenticate, getQuizById);

router.post(
  "/quizzes/:id/publish",
  authenticate,
  authorize(Role.LECTURER),
  publishQuiz,
);

router.post(
  "/quizzes/:id/questions",
  authenticate,
  authorize(Role.LECTURER),
  validate(addQuestionSchema),
  addQuestion,
);

// ─── Attempts ──────────────────────────────────────────────────────────────
router.post(
  "/quizzes/:id/start",
  authenticate,
  authorize(Role.STUDENT),
  startAttempt,
);

router.post(
  "/attempts/:id/answer",
  authenticate,
  authorize(Role.STUDENT),
  validate(submitAnswerSchema),
  saveAnswer,
);

router.post(
  "/attempts/:id/submit",
  authenticate,
  authorize(Role.STUDENT),
  submitAttempt,
);

router.get(
  "/attempts/:id/result",
  authenticate,
  getAttemptResult,
);

// ─── Mock generation ───────────────────────────────────────────────────────
router.post(
  "/quizzes/generate-mock",
  authenticate,
  authorize(Role.LECTURER),
  generateQuiz,
);

export default router;