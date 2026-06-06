import {
  QuizStatus,
  QuestionType,
  AttemptStatus,
} from "@prisma/client";
import { PaginatedResult } from "../../common/types/pagination.types";

// Re-export Prisma enums for convenience
export { QuizStatus, QuestionType, AttemptStatus };

// ─── Shared Interfaces ───────────────────────────────────────────────────────

/**
 * A single MCQ option — id is what gets stored as correctAnswer
 * text is what the student sees
 */
export interface QuestionOption {
  id: string;
  text: string;
}

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateQuizDto {
  title: string;
  description?: string;
  timeLimitMin?: number;
  maxAttempts: number;
  passingScore: number;
}

export interface AddQuestionDto {
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  order: number;
}

export interface SubmitAnswerDto {
  questionId: string;
  selectedOption?: string;
  textAnswer?: string;
}

// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface QuizListItemDto {
  id: string;
  title: string;
  status: QuizStatus;
  questionCount: number;
  timeLimitMin: number | null;
  maxAttempts: number;
  passingScore: number;
  aiGenerated: boolean;
}

export interface QuizDetailDto {
  id: string;
  title: string;
  description: string | null;
  status: QuizStatus;
  timeLimitMin: number | null;
  maxAttempts: number;
  passingScore: number;
  courseId: string;
  aiGenerated: boolean;
  questions: QuestionDetailDto[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Question as returned in quiz detail
 * correctAnswer is intentionally excluded — never sent to students
 */
export interface QuestionDetailDto {
  id: string;
  type: QuestionType;
  text: string;
  options: QuestionOption[] | null;
  points: number;
  order: number;
  explanation: string | null;
}

export interface StudentAnswerDto {
  questionId: string;
  questionText: string;
  selectedOption: string | null;
  textAnswer: string | null;
  correctAnswer: string | null;  // only populated after grading
  isCorrect: boolean | null;     // null for SHORT_ANSWER pending manual grade
  pointsAwarded: number | null;
  explanation: string | null;
}

export interface AttemptResultDto {
  id: string;
  quizId: string;
  studentId: string;
  status: AttemptStatus;
  score: number | null;          // null until graded
  passed: boolean | null;        // null until graded
  startedAt: Date;
  submittedAt: Date | null;
  answers: StudentAnswerDto[];
}

// ─── Paginated aliases ───────────────────────────────────────────────────────

export type QuizPaginatedResult = PaginatedResult<QuizListItemDto>;