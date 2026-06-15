import type { LecturerAnalytics, SubmissionSummary } from '@/features/dashboard/lecturer/types';

export const MOCK_LECTURER_ANALYTICS: LecturerAnalytics = {
  activeCourses: 4,
  pendingSubmissions: 23,
  atRiskStudents: 7,
  averageGrade: 74.2,
  totalStudents: 118,
  gradedThisWeek: 31,
};

export const MOCK_PENDING_SUBMISSIONS: SubmissionSummary[] = [
  {
    id: 'sub_001',
    studentName: 'Amara Osei',
    studentAvatar: null,
    courseTitle: 'Introduction to Data Science',
    assignmentTitle: 'Week 4 — Exploratory Analysis',
    submittedAt: '2025-06-12T09:14:00Z',
    status: 'pending',
  },
  {
    id: 'sub_002',
    studentName: 'James Mutua',
    studentAvatar: null,
    courseTitle: 'Web Development Fundamentals',
    assignmentTitle: 'CSS Layout Challenge',
    submittedAt: '2025-06-11T16:45:00Z',
    status: 'pending',
  },
  {
    id: 'sub_003',
    studentName: 'Fatima Al-Rashid',
    studentAvatar: null,
    courseTitle: 'Introduction to Data Science',
    assignmentTitle: 'Week 4 — Exploratory Analysis',
    submittedAt: '2025-06-11T11:20:00Z',
    status: 'pending',
  },
  {
    id: 'sub_004',
    studentName: 'Kwame Asante',
    studentAvatar: null,
    courseTitle: 'Machine Learning Basics',
    assignmentTitle: 'Linear Regression Lab',
    submittedAt: '2025-06-10T14:08:00Z',
    status: 'pending',
  },
  {
    id: 'sub_005',
    studentName: 'Priya Nair',
    studentAvatar: null,
    courseTitle: 'Web Development Fundamentals',
    assignmentTitle: 'JavaScript DOM Manipulation',
    submittedAt: '2025-06-10T09:55:00Z',
    status: 'pending',
  },
];