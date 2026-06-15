export type SubmissionStatus =
  | 'pending'
  | 'graded'
  | 'late'
  | 'resubmitted'

export interface SubmissionSummary {
  id: string
  studentName: string
  studentAvatar: string | null
  courseTitle: string
  assignmentTitle: string
  submittedAt: string
  status: SubmissionStatus
}

export type SubmissionPriority =
  | 'high'
  | 'medium'
  | 'low'