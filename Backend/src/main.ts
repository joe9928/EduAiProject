import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./modules/auth/auth.router";
import courseRouter from "./modules/courses/course.router";
import assignmentRouter from "./modules/assignments/assignment.router"
import  quizRouter from "./modules/quizzes/quiz.router"
import  discussionRouter from "./modules/discussions/discussion.router"
import notificationRouter from "./modules/notifications/notification.router"
import { globalErrorHandler } from "./common/middleware/error.middleware";
import { authenticate } from "./common/middleware/jwt.middleware";
import { validate } from "./common/middleware/validate.middleware";
import { trackProgressSchema } from "./modules/courses/course.validation";
import { trackProgress } from "./modules/courses/course.controller";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── Routers ────────────────────────────────────────────────────────────────
app.use("/auth", authRouter);
app.use("/courses", courseRouter);
app.use("/", assignmentRouter);
app.use("/", quizRouter);
app.use("/", discussionRouter);
app.use("/", notificationRouter);

// Lesson progress lives outside /courses
app.post(
  "/lessons/:lessonId/progress",
  authenticate,
  validate(trackProgressSchema),
  trackProgress,
);

// ─── Error handling (must be last) ──────────────────────────────────────────
app.use(globalErrorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EduAI API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

export default app;