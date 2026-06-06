import { SubmissionStatus } from "@prisma/client";
import { PaginatedResult } from "../../common/types/pagination.types";

export interface CreateAssignmentDto {
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  allowLate: boolean;
}

export interface SubmitAssignmentDto {
  fileUrl?: string;
  textContent?: string;
}

export interface GradeSubmissionDto {
  score: number;
  feedback?: string;
}

export interface AssignmentListItemDto {
  id: string;
  title: string;
  dueDate: Date;
  maxScore: number;
  allowLate: boolean;
  submissionStatus?: SubmissionStatus;
}

export interface AssignmentResponseDto {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  allowLate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionResponseDto {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string | null;
  textContent: string | null;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  gradedAt: Date | null;
  gradedById: string | null;
  submittedAt: Date;
}

export type AssignmentPaginatedResult = PaginatedResult<AssignmentListItemDto>;