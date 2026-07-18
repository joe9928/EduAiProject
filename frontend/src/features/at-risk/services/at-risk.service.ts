// src/features/at-risk/services/at-risk.service.ts
// Mock-first. Swap function bodies when backend is ready.
// GET /analytics/at-risk    → fetchAtRiskStudents()
// POST /interventions        → logIntervention()

import type {
  AtRiskStudent,
  AtRiskFilters,
  LogInterventionPayload,
  Intervention,
} from '../types/at-risk.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_AT_RISK_STUDENTS: AtRiskStudent[] = [
  {
    id: 'stu_008',
    name: 'Chidi Okonkwo',
    avatar: null,
    email: 'chidi@edu.learn',
    courseTitle: 'Introduction to Data Science',
    courseId: 'course_001',
    riskLevel: 'high',
    overallGrade: 51,
    assignmentCompletion: 40,
    engagementScore: 22,
    lastActive: '2025-06-05T10:00:00Z',
    riskFactors: [
      {
        type: 'missed_assignments',
        label: 'Missed 3 assignments',
        detail: '3 of the last 5 assignments were not submitted on time.',
        severity: 'high',
      },
      {
        type: 'declining_grades',
        label: 'Grades declining',
        detail: 'Average grade dropped from 72% in Week 1 to 45% in Week 4.',
        severity: 'high',
      },
      {
        type: 'low_engagement',
        label: 'Low platform engagement',
        detail: 'Only 22% engagement score — logged in fewer than 3 times in the last 2 weeks.',
        severity: 'medium',
      },
    ],
    interventions: [
      {
        id: 'int_001',
        type: 'email',
        note: 'Sent a check-in email asking if Chidi needs support or an extension.',
        createdAt: '2025-06-06T09:00:00Z',
        createdBy: 'Dr. Smith',
      },
    ],
  },
  {
    id: 'stu_004',
    name: 'Kwame Asante',
    avatar: null,
    email: 'kwame@edu.learn',
    courseTitle: 'Introduction to Data Science',
    courseId: 'course_001',
    riskLevel: 'high',
    overallGrade: 59,
    assignmentCompletion: 60,
    engagementScore: 35,
    lastActive: '2025-06-08T14:30:00Z',
    riskFactors: [
      {
        type: 'low_quiz_scores',
        label: 'Below-average quiz scores',
        detail: 'Averaging 48% on quizzes, well below the class average of 74%.',
        severity: 'high',
      },
      {
        type: 'missed_deadlines',
        label: 'Missed 2 deadlines',
        detail: '2 assignments submitted more than 48 hours after the deadline.',
        severity: 'medium',
      },
    ],
    interventions: [],
  },
  {
    id: 'stu_010',
    name: 'Omar Hassan',
    avatar: null,
    email: 'omar@edu.learn',
    courseTitle: 'Web Development Fundamentals',
    courseId: 'course_002',
    riskLevel: 'high',
    overallGrade: 62,
    assignmentCompletion: 50,
    engagementScore: 41,
    lastActive: '2025-06-09T08:00:00Z',
    riskFactors: [
      {
        type: 'attendance_drop',
        label: 'Attendance dropped 38%',
        detail: 'Live session attendance fell from 90% in Month 1 to 52% in Month 2.',
        severity: 'high',
      },
      {
        type: 'late_submissions',
        label: '3 late submissions',
        detail: '3 of the last 4 submissions were received after the deadline.',
        severity: 'medium',
      },
    ],
    interventions: [
      {
        id: 'int_002',
        type: 'meeting',
        note: 'Met with Omar to discuss workload balance. He is managing a part-time job. Agreed to a flexible submission schedule for the next two weeks.',
        createdAt: '2025-06-10T11:00:00Z',
        createdBy: 'Dr. Smith',
      },
      {
        id: 'int_003',
        type: 'extension_granted',
        note: 'Granted 5-day extension on the CSS Layout assignment.',
        createdAt: '2025-06-10T11:30:00Z',
        createdBy: 'Dr. Smith',
      },
    ],
  },
  {
    id: 'stu_012',
    name: 'Sofia Martínez',
    avatar: null,
    email: 'sofia@edu.learn',
    courseTitle: 'Web Development Fundamentals',
    courseId: 'course_002',
    riskLevel: 'medium',
    overallGrade: 68,
    assignmentCompletion: 75,
    engagementScore: 55,
    lastActive: '2025-06-11T16:00:00Z',
    riskFactors: [
      {
        type: 'declining_grades',
        label: 'Grades trending down',
        detail: 'Grades have declined 3 weeks in a row — from 82% to 65%.',
        severity: 'medium',
      },
      {
        type: 'no_recent_activity',
        label: 'No activity in 7 days',
        detail: 'Last platform login was 7 days ago. No lesson or assignment activity since.',
        severity: 'medium',
      },
    ],
    interventions: [],
  },
  {
    id: 'stu_002',
    name: 'James Mutua',
    avatar: null,
    email: 'james@edu.learn',
    courseTitle: 'Introduction to Data Science',
    courseId: 'course_001',
    riskLevel: 'medium',
    overallGrade: 71,
    assignmentCompletion: 80,
    engagementScore: 58,
    lastActive: '2025-06-12T09:00:00Z',
    riskFactors: [
      {
        type: 'low_quiz_scores',
        label: 'Struggling with quizzes',
        detail: 'Quiz average of 61% is 13 points below the class mean.',
        severity: 'medium',
      },
    ],
    interventions: [
      {
        id: 'int_004',
        type: 'note',
        note: 'James attended office hours. Struggling with statistical concepts in Week 3. Recommended supplementary reading.',
        createdAt: '2025-06-11T14:00:00Z',
        createdBy: 'Dr. Smith',
      },
    ],
  },
  {
    id: 'stu_001',
    name: 'Amara Osei',
    avatar: null,
    email: 'amara@edu.learn',
    courseTitle: 'Introduction to Data Science',
    courseId: 'course_001',
    riskLevel: 'low',
    overallGrade: 79,
    assignmentCompletion: 80,
    engagementScore: 70,
    lastActive: '2025-06-12T08:00:00Z',
    riskFactors: [
      {
        type: 'missed_assignments',
        label: 'One missing submission',
        detail: 'Week 4 Exploratory Analysis was submitted late — now flagged as outstanding.',
        severity: 'low',
      },
    ],
    interventions: [],
  },
  {
    id: 'stu_013',
    name: 'Arjun Sharma',
    avatar: null,
    email: 'arjun@edu.learn',
    courseTitle: 'Web Development Fundamentals',
    courseId: 'course_002',
    riskLevel: 'low',
    overallGrade: 81,
    assignmentCompletion: 75,
    engagementScore: 65,
    lastActive: '2025-06-11T10:00:00Z',
    riskFactors: [
      {
        type: 'late_submissions',
        label: 'Late pattern emerging',
        detail: '2 of the last 3 submissions were received within 24 hours after the deadline.',
        severity: 'low',
      },
    ],
    interventions: [],
  },
]

const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms))

// ─── Service functions ────────────────────────────────────────────────────────

export async function fetchAtRiskStudents(
  _filters?: Partial<AtRiskFilters>
): Promise<AtRiskStudent[]> {
  await delay()
  // Real: return fetch('/api/analytics/at-risk').then(r => r.json())
  return MOCK_AT_RISK_STUDENTS
}

export async function logIntervention(
  payload: LogInterventionPayload
): Promise<Intervention> {
  await delay(400)
  // Real: return fetch('/api/interventions', {
  //   method: 'POST', body: JSON.stringify(payload)
  // }).then(r => r.json())
  return {
    id:        `int_${Date.now()}`,
    type:      payload.type,
    note:      payload.note,
    createdAt: new Date().toISOString(),
    createdBy: 'Dr. Smith',
  }
}