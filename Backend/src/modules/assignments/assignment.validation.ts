import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  dueDate: z
    .string()
    .datetime({ message: "Invalid ISO 8601 datetime" })
    .transform((s) => new Date(s)),
  maxScore: z.number().int().positive().max(1000),
  allowLate: z.boolean(),
});

export const submitAssignmentSchema = z
  .object({
    fileUrl: z.string().url("Invalid URL").optional(),
    textContent: z.string().min(1).optional(),
  })
  .refine((data) => data.fileUrl || data.textContent, {
    message: "Either fileUrl or textContent is required",
  });

export const gradeSubmissionSchema = z.object({
  score: z.number().int().min(0, "Score cannot be negative"),
  feedback: z.string().optional(),
});

export const assignmentFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const submissionFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.nativeEnum(SubmissionStatus).optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type AssignmentFilterInput = z.infer<typeof assignmentFilterSchema>;
export type SubmissionFilterInput = z.infer<typeof submissionFilterSchema>;