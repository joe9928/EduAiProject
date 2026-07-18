// src/features/courses/types/course.types.ts

export type CourseStatus = 'published' | 'draft' | 'archived'

export type CourseStatusFilter = 'all' | CourseStatus

export type CourseSortKey =
  | 'lastUpdated'
  | 'title'
  | 'studentCount'
  | 'pendingSubmissions'

export interface LecturerCourse {
  id: string
  title: string
  description: string
  status: CourseStatus
  coverColor: string
  studentCount: number
  lessonCount: number
  moduleCount: number
  assignmentCount: number
  pendingSubmissions: number
  averageGrade: number
  completionRate: number
  lastUpdated: string
  semester: string
}

export interface CourseFilters {
  status: CourseStatusFilter
  sort: CourseSortKey
  search: string
}

export interface CreateCoursePayload {
  title: string
  description: string
  semester: string
}

export interface UpdateCoursePayload {
  id: string
  title?: string
  description?: string
  semester?: string
}

export const courseQueryKeys = {
  all:    ['courses'] as const,
  list:   (filters?: Partial<CourseFilters>) => ['courses', 'list', filters ?? {}] as const,
  detail: (id: string) => ['courses', id] as const,
}