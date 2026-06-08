import { prisma } from "../../database/prisma.client";

export class AnalyticsRepository {

  // ─── Shared ────────────────────────────────────────────────────────────────

  async getTotalLessons(courseId: string): Promise<number> {
    return prisma.lesson.count({
      where: { deletedAt: null, module: { courseId, deletedAt: null } },
    });
  }

  async getEnrollment(studentId: string, courseId: string) {
    return prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
  }

  async getEnrolledStudents(courseId: string) {
    return prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  // ─── Student-scoped queries ───────────────────────────────────────────────

  async studentCompletionStats(userId: string, courseId: string) {
    return prisma.lessonProgress.count({
      where: {
        userId,
        completed: true,
        lesson: { module: { courseId } },
      },
    });
  }

  async studentQuizStats(userId: string, courseId: string) {
    return prisma.quizAttempt.findMany({
      where: {
        studentId: userId,
        status: "GRADED",
        quiz: { courseId },
      },
      select: { score: true, quiz: { select: { passingScore: true } } },
    });
  }

  async studentAssignmentStats(userId: string, courseId: string) {
    const [total, submissions] = await Promise.all([
      prisma.assignment.count({
        where: { courseId, deletedAt: null },
      }),
      prisma.submission.findMany({
        where: { studentId: userId, assignment: { courseId } },
        select: { status: true, score: true },
      }),
    ]);
    return { total, submissions };
  }

  async studentActivityStats(userId: string, courseId: string, since: Date) {
    const [count, latest] = await Promise.all([
      prisma.activityEvent.count({
        where: { userId, courseId, occurredAt: { gte: since } },
      }),
      prisma.activityEvent.findFirst({
        where: { userId, courseId },
        orderBy: { occurredAt: "desc" },
        select: { occurredAt: true },
      }),
    ]);
    return { count, lastActiveAt: latest?.occurredAt ?? null };
  }

  async studentRiskProfile(userId: string, courseId: string) {
    return prisma.riskProfile.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { level: true, riskScore: true },
    });
  }

  // ─── Course-scoped queries (lecturer view) ────────────────────────────────

  async courseCompletionRates(courseId: string, totalLessons: number) {
    if (totalLessons === 0) return 0;

    // Get completed lesson count per student
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      select: { studentId: true },
    });

    if (enrollments.length === 0) return 0;

    const completionCounts = await Promise.all(
      enrollments.map(({ studentId }) =>
        prisma.lessonProgress.count({
          where: {
            userId: studentId,
            completed: true,
            lesson: { module: { courseId } },
          },
        }),
      ),
    );

    // Average completion rate as percentage
    const rates = completionCounts.map((c) => (c / totalLessons) * 100);
    return rates.reduce((a, b) => a + b, 0) / rates.length;
  }

  async courseQuizScores(courseId: string) {
    return prisma.quizAttempt.findMany({
      where: { status: "GRADED", quiz: { courseId } },
      select: { score: true },
    });
  }

  async courseSubmissionStats(courseId: string) {
    const [total, graded] = await Promise.all([
      prisma.submission.count({
        where: { assignment: { courseId } },
      }),
      prisma.submission.count({
        where: { assignment: { courseId }, status: "GRADED" },
      }),
    ]);
    return { total, graded, pending: total - graded };
  }

  async courseRiskDistribution(courseId: string) {
    const [low, medium, high] = await Promise.all([
      prisma.riskProfile.count({ where: { courseId, level: "LOW" } }),
      prisma.riskProfile.count({ where: { courseId, level: "MEDIUM" } }),
      prisma.riskProfile.count({ where: { courseId, level: "HIGH" } }),
    ]);
    return { low, medium, high };
  }

  async courseStudentScores(courseId: string) {
    // Average quiz score per student — used for top/at-risk student lists
    return prisma.quizAttempt.groupBy({
      by: ["studentId"],
      where: { status: "GRADED", quiz: { courseId } },
      _avg: { score: true },
    });
  }

  async courseAtRiskStudents(courseId: string) {
    return prisma.riskProfile.findMany({
      where: { courseId, level: "HIGH" },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { riskScore: "desc" },
      take: 10,
    });
  }
}