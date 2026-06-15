// src/lib/api/student.ts
import api from './client'

// ── Types aligned to LLD §17.4 ─────────────────────
export interface CourseProgress {
  courseId:      string
  title:         string
  completionPct: number
  avgScore:      number
  thumbnailUrl?: string
  instructor:    string
  lastAccessed?: string
  totalLessons:  number
  completedLessons: number
}

export interface UpcomingDeadline {
  id:       string
  title:    string
  courseId: string
  courseName: string
  dueDate:  string
  type:     'ASSIGNMENT' | 'QUIZ'
}

export interface RecentActivity {
  id:          string
  type:        string
  description: string
  occurredAt:  string
  courseId?:   string
  courseName?: string
}

export interface Recommendation {
  id:           string
  type:         string
  title:        string
  description:  string
  resourceId:   string
  resourceType: 'COURSE' | 'LESSON' | 'QUIZ'
  score:        number
  expiresAt:    string
}

export interface StudentAnalytics {
  overallProgress:  number
  courseProgress:   CourseProgress[]
  recentActivity:   RecentActivity[]
  upcomingDeadlines: UpcomingDeadline[]
  recommendations:  Recommendation[]
}

export interface BrowsableCourse {
  id:            string
  title:         string
  description:   string
  status:        'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  coverImageUrl?: string
  enrollmentCount: number
  lecturer: {
    id:        string
    firstName: string
    lastName:  string
  }
  isEnrolled: boolean
  createdAt:  string
}

export interface CourseCatalogue {
  data:  BrowsableCourse[]
  meta: {
    total:      number
    page:       number
    limit:      number
    totalPages: number
  }
}

export interface QuizQuestion {
  id:       string
  type:     'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER'
  text:     string
  options?: string[]
  points:   number
}

export interface QuizAttempt {
  attemptId:     string
  quizId:        string
  questions:     QuizQuestion[]
  startedAt:     string
  timeLimitMin?: number
}

export interface QuizResult {
  attemptId:   string
  score:       number
  totalPoints: number
  percentage:  number
  passed:      boolean
  answers: {
    questionId:     string
    isCorrect:      boolean
    pointsAwarded:  number
    explanation?:   string
  }[]
}

// ── API functions ──────────────────────────────────
export async function getStudentAnalytics(): Promise<StudentAnalytics> {
  const { data } = await api.get('/analytics/student')
  return data.data
}

export async function getCourseCatalogue(params: {
  page?:   number
  limit?:  number
  search?: string
  status?: string
}): Promise<CourseCatalogue> {
  const { data } = await api.get('/courses', { params })
  return data.data
}

export async function enrollInCourse(courseId: string): Promise<void> {
  await api.post(`/courses/${courseId}/enroll`)
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const { data } = await api.get('/recommendations')
  return data.data
}

export async function dismissRecommendation(id: string): Promise<void> {
  await api.patch(`/recommendations/${id}/dismiss`)
}

export async function startQuiz(quizId: string): Promise<QuizAttempt> {
  const { data } = await api.post(`/quizzes/${quizId}/start`)
  return data.data
}

export async function submitQuiz(
  quizId: string,
  answers: { questionId: string; selectedOption?: string; textAnswer?: string }[]
): Promise<QuizResult> {
  const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers })
  return data.data
}