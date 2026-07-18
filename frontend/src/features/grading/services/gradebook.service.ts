// src/features/grading/services/gradebook.service.ts

import type { GradeBook, UpdateGradePayload, GradeEntry } from '../types/gradebook.types'

const MOCK_GRADEBOOKS: Record<string, GradeBook> = {
  course_001: {
    courseId: 'course_001',
    courseTitle: 'Introduction to Data Science',
    students: [
      { id: 'stu_001', name: 'Amara Osei',       avatar: null, email: 'amara@edu.learn'  },
      { id: 'stu_002', name: 'James Mutua',      avatar: null, email: 'james@edu.learn'  },
      { id: 'stu_003', name: 'Fatima Al-Rashid', avatar: null, email: 'fatima@edu.learn' },
      { id: 'stu_004', name: 'Kwame Asante',     avatar: null, email: 'kwame@edu.learn'  },
      { id: 'stu_005', name: 'Priya Nair',       avatar: null, email: 'priya@edu.learn'  },
      { id: 'stu_006', name: 'David Kimani',     avatar: null, email: 'david@edu.learn'  },
      { id: 'stu_007', name: 'Aisha Diallo',     avatar: null, email: 'aisha@edu.learn'  },
      { id: 'stu_008', name: 'Chidi Okonkwo',    avatar: null, email: 'chidi@edu.learn'  },
    ],
    assignments: [
      { id: 'asgn_001', title: 'Week 1 Quiz',           maxScore: 100, dueDate: '2025-05-10T23:59:00Z', courseId: 'course_001', weight: 10 },
      { id: 'asgn_002', title: 'Data Cleaning Lab',     maxScore: 100, dueDate: '2025-05-20T23:59:00Z', courseId: 'course_001', weight: 15 },
      { id: 'asgn_003', title: 'EDA Assignment',        maxScore: 100, dueDate: '2025-06-01T23:59:00Z', courseId: 'course_001', weight: 20 },
      { id: 'asgn_004', title: 'Midterm',               maxScore: 100, dueDate: '2025-06-10T23:59:00Z', courseId: 'course_001', weight: 25 },
      { id: 'asgn_005', title: 'Visualisation Project', maxScore: 100, dueDate: '2025-06-20T23:59:00Z', courseId: 'course_001', weight: 30 },
    ],
    entries: [
      { studentId: 'stu_001', assignmentId: 'asgn_001', grade: 88,   submissionId: 'sub_a01', status: 'graded'  },
      { studentId: 'stu_001', assignmentId: 'asgn_002', grade: 91,   submissionId: 'sub_a02', status: 'graded'  },
      { studentId: 'stu_001', assignmentId: 'asgn_003', grade: null, submissionId: 'sub_001', status: 'late'    },
      { studentId: 'stu_001', assignmentId: 'asgn_004', grade: 79,   submissionId: 'sub_a04', status: 'graded'  },
      { studentId: 'stu_001', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_002', assignmentId: 'asgn_001', grade: 74,   submissionId: 'sub_b01', status: 'graded'  },
      { studentId: 'stu_002', assignmentId: 'asgn_002', grade: 68,   submissionId: 'sub_b02', status: 'graded'  },
      { studentId: 'stu_002', assignmentId: 'asgn_003', grade: 72,   submissionId: 'sub_b03', status: 'graded'  },
      { studentId: 'stu_002', assignmentId: 'asgn_004', grade: 81,   submissionId: 'sub_b04', status: 'graded'  },
      { studentId: 'stu_002', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'pending' },
      { studentId: 'stu_003', assignmentId: 'asgn_001', grade: 95,   submissionId: 'sub_c01', status: 'graded'  },
      { studentId: 'stu_003', assignmentId: 'asgn_002', grade: 98,   submissionId: 'sub_c02', status: 'graded'  },
      { studentId: 'stu_003', assignmentId: 'asgn_003', grade: null, submissionId: 'sub_003', status: 'pending' },
      { studentId: 'stu_003', assignmentId: 'asgn_004', grade: 92,   submissionId: 'sub_c04', status: 'graded'  },
      { studentId: 'stu_003', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_004', assignmentId: 'asgn_001', grade: 61,   submissionId: 'sub_d01', status: 'graded'  },
      { studentId: 'stu_004', assignmentId: 'asgn_002', grade: 55,   submissionId: 'sub_d02', status: 'graded'  },
      { studentId: 'stu_004', assignmentId: 'asgn_003', grade: null, submissionId: 'sub_004', status: 'pending' },
      { studentId: 'stu_004', assignmentId: 'asgn_004', grade: 63,   submissionId: 'sub_d04', status: 'graded'  },
      { studentId: 'stu_004', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_005', assignmentId: 'asgn_001', grade: 82,   submissionId: 'sub_e01', status: 'graded'  },
      { studentId: 'stu_005', assignmentId: 'asgn_002', grade: 79,   submissionId: 'sub_e02', status: 'graded'  },
      { studentId: 'stu_005', assignmentId: 'asgn_003', grade: null, submissionId: 'sub_005', status: 'pending' },
      { studentId: 'stu_005', assignmentId: 'asgn_004', grade: 85,   submissionId: 'sub_e04', status: 'graded'  },
      { studentId: 'stu_005', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_006', assignmentId: 'asgn_001', grade: 90,   submissionId: 'sub_f01', status: 'graded'  },
      { studentId: 'stu_006', assignmentId: 'asgn_002', grade: 87,   submissionId: 'sub_f02', status: 'graded'  },
      { studentId: 'stu_006', assignmentId: 'asgn_003', grade: 82,   submissionId: 'sub_f03', status: 'graded'  },
      { studentId: 'stu_006', assignmentId: 'asgn_004', grade: 91,   submissionId: 'sub_f04', status: 'graded'  },
      { studentId: 'stu_006', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'pending' },
      { studentId: 'stu_007', assignmentId: 'asgn_001', grade: 77,   submissionId: 'sub_g01', status: 'graded'  },
      { studentId: 'stu_007', assignmentId: 'asgn_002', grade: 91,   submissionId: 'sub_g02', status: 'graded'  },
      { studentId: 'stu_007', assignmentId: 'asgn_003', grade: 85,   submissionId: 'sub_g03', status: 'graded'  },
      { studentId: 'stu_007', assignmentId: 'asgn_004', grade: 88,   submissionId: 'sub_g04', status: 'graded'  },
      { studentId: 'stu_007', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'pending' },
      { studentId: 'stu_008', assignmentId: 'asgn_001', grade: 45,   submissionId: 'sub_h01', status: 'graded'  },
      { studentId: 'stu_008', assignmentId: 'asgn_002', grade: 52,   submissionId: 'sub_h02', status: 'graded'  },
      { studentId: 'stu_008', assignmentId: 'asgn_003', grade: null, submissionId: 'sub_008', status: 'late'    },
      { studentId: 'stu_008', assignmentId: 'asgn_004', grade: 58,   submissionId: 'sub_h04', status: 'graded'  },
      { studentId: 'stu_008', assignmentId: 'asgn_005', grade: null, submissionId: null,       status: 'missing' },
    ],
  },
  course_002: {
    courseId: 'course_002',
    courseTitle: 'Web Development Fundamentals',
    students: [
      { id: 'stu_009', name: 'Lena Fischer',   avatar: null, email: 'lena@edu.learn'  },
      { id: 'stu_010', name: 'Omar Hassan',    avatar: null, email: 'omar@edu.learn'  },
      { id: 'stu_011', name: 'Yuki Tanaka',    avatar: null, email: 'yuki@edu.learn'  },
      { id: 'stu_012', name: 'Sofia Martínez', avatar: null, email: 'sofia@edu.learn' },
      { id: 'stu_013', name: 'Arjun Sharma',   avatar: null, email: 'arjun@edu.learn' },
    ],
    assignments: [
      { id: 'asgn_101', title: 'HTML Basics',  maxScore: 100, dueDate: '2025-05-12T23:59:00Z', courseId: 'course_002', weight: 15 },
      { id: 'asgn_102', title: 'CSS Layout',   maxScore: 100, dueDate: '2025-05-25T23:59:00Z', courseId: 'course_002', weight: 20 },
      { id: 'asgn_103', title: 'JS DOM',       maxScore: 100, dueDate: '2025-06-05T23:59:00Z', courseId: 'course_002', weight: 25 },
      { id: 'asgn_104', title: 'React Intro',  maxScore: 100, dueDate: '2025-06-15T23:59:00Z', courseId: 'course_002', weight: 40 },
    ],
    entries: [
      { studentId: 'stu_009', assignmentId: 'asgn_101', grade: 92,   submissionId: 'sub_i01', status: 'graded'  },
      { studentId: 'stu_009', assignmentId: 'asgn_102', grade: 88,   submissionId: 'sub_i02', status: 'graded'  },
      { studentId: 'stu_009', assignmentId: 'asgn_103', grade: null, submissionId: null,       status: 'pending' },
      { studentId: 'stu_009', assignmentId: 'asgn_104', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_010', assignmentId: 'asgn_101', grade: 78,   submissionId: 'sub_j01', status: 'graded'  },
      { studentId: 'stu_010', assignmentId: 'asgn_102', grade: null, submissionId: 'sub_j02', status: 'late'    },
      { studentId: 'stu_010', assignmentId: 'asgn_103', grade: null, submissionId: null,       status: 'pending' },
      { studentId: 'stu_010', assignmentId: 'asgn_104', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_011', assignmentId: 'asgn_101', grade: 95,   submissionId: 'sub_k01', status: 'graded'  },
      { studentId: 'stu_011', assignmentId: 'asgn_102', grade: 93,   submissionId: 'sub_k02', status: 'graded'  },
      { studentId: 'stu_011', assignmentId: 'asgn_103', grade: 91,   submissionId: 'sub_k03', status: 'graded'  },
      { studentId: 'stu_011', assignmentId: 'asgn_104', grade: null, submissionId: null,       status: 'pending' },
      { studentId: 'stu_012', assignmentId: 'asgn_101', grade: 65,   submissionId: 'sub_l01', status: 'graded'  },
      { studentId: 'stu_012', assignmentId: 'asgn_102', grade: 71,   submissionId: 'sub_l02', status: 'graded'  },
      { studentId: 'stu_012', assignmentId: 'asgn_103', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_012', assignmentId: 'asgn_104', grade: null, submissionId: null,       status: 'missing' },
      { studentId: 'stu_013', assignmentId: 'asgn_101', grade: 83,   submissionId: 'sub_m01', status: 'graded'  },
      { studentId: 'stu_013', assignmentId: 'asgn_102', grade: 79,   submissionId: 'sub_m02', status: 'graded'  },
      { studentId: 'stu_013', assignmentId: 'asgn_103', grade: null, submissionId: null,       status: 'pending' },
      { studentId: 'stu_013', assignmentId: 'asgn_104', grade: null, submissionId: null,       status: 'missing' },
    ],
  },
}

const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms))

export async function fetchGradeBook(courseId: string): Promise<GradeBook> {
  await delay()
  const book = MOCK_GRADEBOOKS[courseId]
  if (!book) throw new Error(`No gradebook found for course ${courseId}`)
  return book
}

export async function updateGrade(payload: UpdateGradePayload): Promise<GradeEntry> {
  await delay(300)
  return {
    studentId:    payload.studentId,
    assignmentId: payload.assignmentId,
    grade:        payload.grade,
    submissionId: null,
    status:       'graded',
  }
}