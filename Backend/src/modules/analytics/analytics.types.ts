import { RiskLevel } from "@prisma/client";

// ─── Student Analytics ───────────────────────────────────────────────────────

export interface LessonProgressStats {
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
}

export interface QuizStats {
  totalAttempts: number;
  averageScore: number | null;
  passRate: number | null;        // percentage of attempts that passed
  bestScore: number | null;
}

export interface AssignmentStats {
  totalAssignments: number;
  submitted: number;
  graded: number;
  pending: number;                // submitted but not yet graded
  averageScore: number | null;
}

export interface ActivityStats {
  eventsLast7Days: number;
  lastActiveAt: Date | null;
}

export interface StudentCourseAnalytics {
  courseId: string;
  enrolledAt: Date;
  lessonProgress: LessonProgressStats;
  quizStats: QuizStats;
  assignmentStats: AssignmentStats;
  activityStats: ActivityStats;
  riskLevel: RiskLevel | null;    // null if no profile calculated yet
  riskScore: number | null;
}

// ─── Lecturer Analytics ──────────────────────────────────────────────────────

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

export interface StudentSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  completionPercentage: number;
  averageScore: number | null;
  riskLevel: RiskLevel | null;
}

export interface LecturerCourseAnalytics {
  courseId: string;
  totalStudents: number;
  averageCompletionRate: number;  // 0-100 percentage
  averageQuizScore: number | null;
  submissionStats: {
    total: number;
    graded: number;
    pending: number;
  };
  riskDistribution: RiskDistribution;
  topStudents: StudentSummary[];       // top 5 by score
  atRiskStudents: StudentSummary[];    // HIGH risk students
}