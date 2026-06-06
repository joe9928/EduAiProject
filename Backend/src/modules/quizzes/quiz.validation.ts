// quiz.validation.ts
// ============================================================================
// QUIZ MODULE — Zod Validation Schemas
// ============================================================================
// Validates incoming request payloads for the Quiz Module
// ============================================================================

import { z } from "zod";
import { QuizStatus, QuestionType, AttemptStatus } from "@prisma/client";

// ─── Common Schemas ───────────────────────────────────────────────────────────

/** Shared schema for question options (MCQ) */
export const questionOptionSchema = z.object({
  id: z.string().min(1, "Option ID cannot be empty"),
  text: z.string().min(1, "Option text cannot be empty"),
});

/** UUID string schema — reused across multiple DTOs */
export const uuidSchema = z.string().uuid("Invalid UUID format");

// ─── Request Schemas ─────────────────────────────────────────────────────────

/**
 * Validation for quiz creation
 *
 * Constraints:
 * - title: required, 1-255 chars
 * - description: optional, max 2000 chars
 * - timeLimitMin: optional, must be positive integer if provided
 * - maxAttempts: required, minimum 1
 * - passingScore: required, 0-100 inclusive
 */
export const createQuizSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  timeLimitMin: z
    .number()
    .int()
    .positive("Time limit must be a positive integer")
    .optional(),
  maxAttempts: z
    .number()
    .int()
    .min(1, "Maximum attempts must be at least 1"),
  passingScore: z
    .number()
    .int()
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score cannot exceed 100"),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

/**
 * Validation for adding a question to a quiz
 *
 * Constraints:
 * - type: must be a valid QuestionType enum value
 * - text: required, 1-2000 chars
 * - options: optional array — min/max per type enforced in service layer
 * - correctAnswer: optional here — required for MCQ/TRUE_FALSE enforced in service
 * - explanation: optional, max 1000 chars
 * - points: required, minimum 1
 * - order: required, minimum 1
 */
export const addQuestionSchema = z.object({
  type: z.nativeEnum(QuestionType, {
    error: "Invalid question type",
  }),
  text: z
    .string()
    .min(1, "Question text is required")
    .max(2000, "Question text cannot exceed 2000 characters"),
  options: z.array(questionOptionSchema).optional(),
  correctAnswer: z.string().optional(),
  explanation: z
    .string()
    .max(1000, "Explanation cannot exceed 1000 characters")
    .optional(),
  points: z
    .number()
    .int()
    .min(1, "Points must be at least 1"),
  order: z
    .number()
    .int()
    .min(1, "Order must be at least 1"),
});

export type AddQuestionInput = z.infer<typeof addQuestionSchema>;

/**
 * Validation for saving an answer during an attempt
 *
 * No refine() here — allowing partial/empty saves mid-attempt is intentional.
 * The service enforces that all required questions are answered at submit time.
 * textAnswer max raised to 5000 to accommodate SHORT_ANSWER responses.
 */
export const submitAnswerSchema = z.object({
  questionId: uuidSchema,
  selectedOption: z.string().optional(),
  textAnswer: z
    .string()
    .max(5000, "Text answer cannot exceed 5000 characters")
    .optional(),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

// ─── Filter / Query Schemas ───────────────────────────────────────────────────

/**
 * Validation for quiz listing filters
 *
 * Constraints:
 * - page: defaults to 1, coerced from query string
 * - limit: defaults to 10, coerced from query string, max 100
 * - status: optional filter by quiz status
 * - search: optional search term, max 100 chars
 */
export const quizFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.nativeEnum(QuizStatus).optional(),
  search: z.string().max(100).optional(),
});

export type QuizFilterInput = z.infer<typeof quizFilterSchema>;

/**
 * Validation for attempt listing filters
 */
export const attemptFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  quizId: uuidSchema.optional(),
  status: z.nativeEnum(AttemptStatus).optional(),
});

export type AttemptFilterInput = z.infer<typeof attemptFilterSchema>;

// ─── Param Schemas ────────────────────────────────────────────────────────────
// These are available if needed but route params are primarily
// handled via req.params casting in controllers per project convention

/** Schema for validating quiz ID parameter */
export const quizIdParamSchema = z.object({
  quizId: uuidSchema,
});

export type QuizIdParam = z.infer<typeof quizIdParamSchema>;

/** Schema for validating attempt ID parameter */
export const attemptIdParamSchema = z.object({
  attemptId: uuidSchema,
});

export type AttemptIdParam = z.infer<typeof attemptIdParamSchema>;