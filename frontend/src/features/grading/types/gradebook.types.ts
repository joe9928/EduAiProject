// src/features/grading/types/gradebook.types.ts

export type GradeEntryStatus = 'graded' | 'pending' | 'missing' | 'late'

export interface GradeBookStudent {
  id: string
  name: string
  avatar: string | null
  email: string
}

export interface GradeBookAssignment {
  id: string
  title: string
  maxScore: number
  dueDate: string
  courseId: string
  weight: number
}

export interface GradeEntry {
  studentId: string
  assignmentId: string
  grade: number | null
  submissionId: string | null
  status: GradeEntryStatus
}

export interface GradeBook {
  courseId: string
  courseTitle: string
  students: GradeBookStudent[]
  assignments: GradeBookAssignment[]
  entries: GradeEntry[]
}

export interface StudentGradeSummary {
  studentId: string
  weightedAverage: number | null
  letterGrade: string | null
  gradeCount: number
  totalAssignments: number
  missingCount: number
}

export interface GradeBookFilters {
  courseId: string
  search: string
}

export interface UpdateGradePayload {
  studentId: string
  assignmentId: string
  grade: number
  courseId: string
}

export const gradeBookQueryKeys = {
  all:    ['gradebook'] as const,
  course: (courseId: string) => ['gradebook', courseId] as const,
}

export function getLetterGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function getGradeColour(score: number | null): string {
  if (score === null) return 'text-[oklch(var(--muted-foreground)/0.4)]'
  if (score >= 80) return 'text-[oklch(var(--spark))]'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}