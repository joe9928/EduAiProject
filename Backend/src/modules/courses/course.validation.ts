import { z } from "zod";
import { CourseStatus, LessonType } from "@prisma/client";

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url("Invalid URL format").optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url("Invalid URL format").optional(),
});

export const courseFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.nativeEnum(CourseStatus).optional(),
  search: z.string().max(255).optional(),
});

export const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).optional(),
  order: z.number().int().positive("Order must be a positive integer"),
});

export const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.nativeEnum(LessonType),
  contentUrl: z.string().url("Invalid URL").optional(),
  contentText: z.string().optional(),
  durationMin: z.number().int().positive().optional(),
  order: z.number().int().positive("Order must be a positive integer"),
});

export const trackProgressSchema = z.object({
  completed: z.boolean(),
  timeSpentSec: z.number().int().min(0),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseFilterInput = z.infer<typeof courseFilterSchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type TrackProgressInput = z.infer<typeof trackProgressSchema>;