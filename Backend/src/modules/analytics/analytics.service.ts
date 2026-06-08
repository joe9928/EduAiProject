import { AnalyticsRepository } from "./analytics.repository";
import {
  StudentCourseAnalytics,
  LecturerCourseAnalytics,
  StudentSummary,
} from "./analytics.types";
import { NotFoundError, ForbiddenError } from "../../common/errors/app.error";
import { prisma } from "../../database/prisma.client";

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  // ─── Student Analytics ────────────────────────────────────────────────────

  async getStudentAnalytics(
    studentId: string,
    courseId: string,
    requesterId: string,
  ): Promise<StudentCourseAnalytics> {
    // Students can only view their own analytics
    if (studentId !== requesterId) {
      throw new ForbiddenError("FORBIDDEN");
    }

    const enrollment = await this.repository.getEnrollment(studentId, courseId);
    if (!enrollment) {
      throw new NotFoundError("Enrollment not found", "ENROLLMENT_NOT_FOUND");
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Run all queries in parallel — as per design decision
    const [
      totalLessons,
      completedLessons,
      quizAttempts,
      assignmentData,
      activityData,
      riskProfile,
    ] = await Promise.all([
      this.repository.getTotalLessons(courseId),
      this.repository.studentCompletionStats(studentId, courseId),
      this.repository.studentQuizStats(studentId, courseId),
      this.repository.studentAssignmentStats(studentId, courseId),
      this.repository.studentActivityStats(studentId, courseId, sevenDaysAgo),
      this.repository.studentRiskProfile(studentId, courseId),
    ]);

    // ── Lesson progress ──
    const completionPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // ── Quiz stats ──
    const gradedScores = quizAttempts
      .map((a) => a.score)
      .filter((s): s is number => s !== null);

    const averageQuizScore =
      gradedScores.length > 0
        ? gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length
        : null;

    const passedAttempts = quizAttempts.filter(
      (a) => a.score !== null && a.score >= a.quiz.passingScore,
    ).length;

    const passRate =
      quizAttempts.length > 0
        ? Math.round((passedAttempts / quizAttempts.length) * 100)
        : null;

    const bestScore =
      gradedScores.length > 0 ? Math.max(...gradedScores) : null;

    // ── Assignment stats ──
    const submitted = assignmentData.submissions.length;
    const graded = assignmentData.submissions.filter(
      (s) => s.status === "GRADED",
    ).length;
    const gradedSubmissionScores = assignmentData.submissions
      .filter((s) => s.score !== null)
      .map((s) => s.score as number);

    const averageAssignmentScore =
      gradedSubmissionScores.length > 0
        ? gradedSubmissionScores.reduce((a, b) => a + b, 0) /
          gradedSubmissionScores.length
        : null;

    return {
      courseId,
      enrolledAt: enrollment.enrolledAt,
      lessonProgress: {
        totalLessons,
        completedLessons,
        completionPercentage,
      },
      quizStats: {
        totalAttempts: quizAttempts.length,
        averageScore: averageQuizScore,
        passRate,
        bestScore,
      },
      assignmentStats: {
        totalAssignments: assignmentData.total,
        submitted,
        graded,
        pending: submitted - graded,
        averageScore: averageAssignmentScore,
      },
      activityStats: {
        eventsLast7Days: activityData.count,
        lastActiveAt: activityData.lastActiveAt,
      },
      riskLevel: riskProfile?.level ?? null,
      riskScore: riskProfile?.riskScore ?? null,
    };
  }

  // ─── Lecturer Analytics ───────────────────────────────────────────────────

  async getLecturerAnalytics(
    courseId: string,
    lecturerId: string,
  ): Promise<LecturerCourseAnalytics> {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    if (course.lecturerId !== lecturerId) throw new ForbiddenError("FORBIDDEN_OWNERSHIP");

    // Run all course-level queries in parallel
    const [
      enrollments,
      totalLessons,
      quizScores,
      submissionStats,
      riskDistribution,
      studentScores,
      atRiskProfiles,
    ] = await Promise.all([
      this.repository.getEnrolledStudents(courseId),
      this.repository.getTotalLessons(courseId),
      this.repository.courseQuizScores(courseId),
      this.repository.courseSubmissionStats(courseId),
      this.repository.courseRiskDistribution(courseId),
      this.repository.courseStudentScores(courseId),
      this.repository.courseAtRiskStudents(courseId),
    ]);

    // ── Average completion rate ──
    const avgCompletionRate = await this.repository.courseCompletionRates(
      courseId,
      totalLessons,
    );

    // ── Average quiz score ──
    const allScores = quizScores
      .map((a) => a.score)
      .filter((s): s is number => s !== null);

    const averageQuizScore =
      allScores.length > 0
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length
        : null;

    // ── Build score lookup for student summaries ──
    const scoreByStudent = new Map(
      studentScores.map((s) => [s.studentId, s._avg.score]),
    );

    // ── Top students — highest average score ──
    const topStudents: StudentSummary[] = enrollments
      .map((e) => ({
        id: e.student.id,
        firstName: e.student.firstName,
        lastName: e.student.lastName,
        email: e.student.email,
        completionPercentage: 0, // simplified — full version calculates per student
        averageScore: scoreByStudent.get(e.student.id) ?? null,
        riskLevel: null,
      }))
      .filter((s) => s.averageScore !== null)
      .sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0))
      .slice(0, 5);

    // ── At-risk students ──
    const atRiskStudents: StudentSummary[] = atRiskProfiles.map((p) => ({
      id: p.user.id,
      firstName: p.user.firstName,
      lastName: p.user.lastName,
      email: p.user.email,
      completionPercentage: 0,
      averageScore: scoreByStudent.get(p.user.id) ?? null,
      riskLevel: p.level,
    }));

    return {
      courseId,
      totalStudents: enrollments.length,
      averageCompletionRate: Math.round(avgCompletionRate),
      averageQuizScore,
      submissionStats,
      riskDistribution,
      topStudents,
      atRiskStudents,
    };
  }
}