import { CourseStatus, LessonType } from "@prisma/client";

export interface CreateCourseDto {
  title: string;
  description?: string;
  coverImageUrl?: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  coverImageUrl?: string;
}

export interface CourseFilterDto {
  page?: number;
  limit?: number;
  status?: CourseStatus;
  search?: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  type: LessonType;
  order: number;
  durationMin: number | null;
  contentUrl: string | null;
}

export interface ModuleSummary {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: LessonSummary[];
}

export interface CourseDetailDto {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  status: CourseStatus;
  lecturer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  modules: ModuleSummary[];
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrollResponseDto {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: Date;
}

// Reusable pagination wrapper — used across all modules
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// DTOs for modules and lessons
export interface CreateModuleDto {
  title: string;
  description?: string;
  order: number;
}

export interface UpdateModuleDto {
  title?: string;
  description?: string;
  order?: number;
}

export interface CreateLessonDto {
  title: string;
  type: LessonType;
  contentUrl?: string;
  contentText?: string;
  durationMin?: number;
  order: number;
}

export interface UpdateLessonDto {
  title?: string;
  contentUrl?: string;
  contentText?: string;
  durationMin?: number;
  order?: number;
}

export interface TrackProgressDto {
  completed: boolean;
  timeSpentSec: number;
}