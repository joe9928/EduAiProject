// course.routes.ts
import { Router } from "express";
import { authenticate, authorize } from "../../common/middleware/jwt.middleware";
import { validate, validateQuery } from "../../common/middleware/validate.middleware";
import { Role } from "@prisma/client";
import {
  courseFilterSchema,
  createCourseSchema,
  updateCourseSchema,
  createModuleSchema,
  createLessonSchema,
  trackProgressSchema,
} from "./course.validation";
import {
  getCourses,
  createCourse,
  getCourseById,
  updateCourse,
  publishCourse,
  archiveCourse,  
  enrollStudent,
  getEnrolledStudents,
  createModule,
  createLesson,
  trackProgress,
} from "./course.controller";

const router = Router();

// ─── Public routes ─────────────────────────────────────────────────────────
// GET /courses – List courses with optional filters (no auth needed)
router.get("/", validateQuery(courseFilterSchema), getCourses);

// ─── Lecturer routes (require LECTURER role) ─────────────────────────────
// POST /courses – Create a new course
router.post(
  "/",
  authenticate,
  authorize(Role.LECTURER),
  validate(createCourseSchema),
  createCourse,
);

// GET /courses/:id – View course details (authenticated users only)
router.get("/:id", authenticate, getCourseById);

// PATCH /courses/:id – Update course (owner check inside service)
router.patch(
  "/:id",
  authenticate,
  authorize(Role.LECTURER),
  validate(updateCourseSchema),
  updateCourse,
);

// POST /courses/:id/publish – Publish a draft course
router.post(
  "/:id/publish",
  authenticate,
  authorize(Role.LECTURER),
  publishCourse,
);

// POST /courses/:id/archive – Archive a course
router.post(
  "/:id/archive",
  authenticate,
  authorize(Role.LECTURER),
  archiveCourse, 
);

// ─── Enrollment routes ──────────────────────────────────────────────────────
// POST /courses/:courseId/enroll – Student self-enrollment
router.post(
  "/:courseId/enroll",
  authenticate,
  authorize(Role.STUDENT), // Only students can enroll
  enrollStudent,
);

// GET /courses/:courseId/students – Lecturer views enrolled students
router.get(
  "/:courseId/students",
  authenticate,
  authorize(Role.LECTURER),
  getEnrolledStudents,
);

// ─── Module & Lesson routes (lecturer only) ─────────────────────────────────
// POST /courses/:courseId/modules – Add a module to a course
router.post(
  "/:courseId/modules",
  authenticate,
  authorize(Role.LECTURER),
  validate(createModuleSchema),
  createModule,
);

// POST /courses/:courseId/modules/:moduleId/lessons – Add a lesson to a module
router.post(
  "/:courseId/modules/:moduleId/lessons",
  authenticate,
  authorize(Role.LECTURER),
  validate(createLessonSchema),
  createLesson,
);



export default router;