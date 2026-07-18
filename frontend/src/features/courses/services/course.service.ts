// src/features/courses/services/course.service.ts

import type {
  LecturerCourse,
  CourseFilters,
  CreateCoursePayload,
} from '../types/course.types'

const MOCK_COURSES: LecturerCourse[] = [
  {
    id: 'course_001',
    title: 'Introduction to Data Science',
    description: 'A comprehensive introduction to data science concepts, tools, and workflows using Python and real-world datasets.',
    status: 'published',
    coverColor: 'var(--spark)',
    studentCount: 42,
    lessonCount: 18,
    moduleCount: 5,
    assignmentCount: 6,
    pendingSubmissions: 11,
    averageGrade: 76.4,
    completionRate: 68,
    lastUpdated: '2025-06-10T08:00:00Z',
    semester: 'Semester 1 2025',
  },
  {
    id: 'course_002',
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, and JavaScript from the ground up. Students build real projects at the end of each module.',
    status: 'published',
    coverColor: 'var(--ocean-300)',
    studentCount: 38,
    lessonCount: 22,
    moduleCount: 6,
    assignmentCount: 8,
    pendingSubmissions: 7,
    averageGrade: 81.2,
    completionRate: 74,
    lastUpdated: '2025-06-11T14:30:00Z',
    semester: 'Semester 1 2025',
  },
  {
    id: 'course_003',
    title: 'Machine Learning Basics',
    description: 'Supervised and unsupervised learning algorithms, model evaluation, and practical implementation with scikit-learn.',
    status: 'published',
    coverColor: 'var(--spark)',
    studentCount: 29,
    lessonCount: 16,
    moduleCount: 4,
    assignmentCount: 5,
    pendingSubmissions: 5,
    averageGrade: 69.8,
    completionRate: 55,
    lastUpdated: '2025-06-09T10:15:00Z',
    semester: 'Semester 1 2025',
  },
  {
    id: 'course_004',
    title: 'Database Design & SQL',
    description: 'Relational database fundamentals, normalisation, complex queries, and an introduction to NoSQL patterns.',
    status: 'draft',
    coverColor: 'var(--ocean-300)',
    studentCount: 0,
    lessonCount: 12,
    moduleCount: 3,
    assignmentCount: 4,
    pendingSubmissions: 0,
    averageGrade: 0,
    completionRate: 0,
    lastUpdated: '2025-06-08T16:45:00Z',
    semester: 'Semester 2 2025',
  },
  {
    id: 'course_005',
    title: 'Advanced React Patterns',
    description: 'Deep dive into React architecture — compound components, render props, custom hooks, and performance optimisation.',
    status: 'archived',
    coverColor: 'var(--spark)',
    studentCount: 31,
    lessonCount: 20,
    moduleCount: 5,
    assignmentCount: 7,
    pendingSubmissions: 0,
    averageGrade: 84.1,
    completionRate: 100,
    lastUpdated: '2025-03-15T09:00:00Z',
    semester: 'Semester 2 2024',
  },
]

const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms))

export async function fetchLecturerCourses(
  _filters?: Partial<CourseFilters>
): Promise<LecturerCourse[]> {
  await delay()
  return MOCK_COURSES
}

export async function publishCourse(id: string): Promise<LecturerCourse> {
  await delay(400)
  const course = MOCK_COURSES.find((c) => c.id === id)
  if (!course) throw new Error('Course not found')
  return { ...course, status: 'published' }
}

export async function archiveCourse(id: string): Promise<LecturerCourse> {
  await delay(400)
  const course = MOCK_COURSES.find((c) => c.id === id)
  if (!course) throw new Error('Course not found')
  return { ...course, status: 'archived' }
}

export async function createCourse(
  payload: CreateCoursePayload
): Promise<LecturerCourse> {
  await delay(500)
  return {
    id: `course_${Date.now()}`,
    title: payload.title,
    description: payload.description,
    status: 'draft',
    coverColor: 'var(--spark)',
    studentCount: 0,
    lessonCount: 0,
    moduleCount: 0,
    assignmentCount: 0,
    pendingSubmissions: 0,
    averageGrade: 0,
    completionRate: 0,
    lastUpdated: new Date().toISOString(),
    semester: payload.semester,
  }
}