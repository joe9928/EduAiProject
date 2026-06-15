export interface LecturerAnalytics {
  activeCourses: number;
  pendingSubmissions: number;
  atRiskStudents: number;
  averageGrade: number;
  totalStudents: number;
  gradedThisWeek: number;
}

export type SubmissionStatus = 'pending' | 'graded' | 'late' | 'resubmitted';

export interface SubmissionSummary {
  id: string;
  studentName: string;
  studentAvatar: string | null;
  courseTitle: string;
  assignmentTitle: string;
  submittedAt: string;
  status: SubmissionStatus;
}