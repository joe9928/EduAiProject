import { RiskLevel, RiskProfile, Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import { RiskFactors, RiskProfileWithStudent } from "./risk.types";
import { RiskFilterInput } from "./risk.validation";
import { PaginatedResult } from "../../common/types/pagination.types";

export class RiskRepository {

  async upsertRiskProfile(
    userId: string,
    courseId: string,
    riskScore: number,
    level: RiskLevel,
    factors: RiskFactors,
  ): Promise<RiskProfile> {
    // Upsert — create if not exists, update if exists
    // @@unique([userId, courseId]) makes this safe
    return prisma.riskProfile.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        userId,
        courseId,
        riskScore,
        level,
        factors: factors as unknown as Prisma.InputJsonValue,
        calculatedAt: new Date(),
      },
      update: {
        riskScore,
        level,
        factors: factors as unknown as Prisma.InputJsonValue,
        calculatedAt: new Date(),
      },
    });
  }

  async findByCourse(
    courseId: string,
    filters: RiskFilterInput,
  ): Promise<PaginatedResult<RiskProfileWithStudent>> {
    const { page, limit, level } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.RiskProfileWhereInput = { courseId };
    if (level) where.level = level;

    const [profiles, total] = await Promise.all([
      prisma.riskProfile.findMany({
        where,
        skip,
        take: limit,
        // Most at-risk students appear first
        orderBy: { riskScore: "desc" },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.riskProfile.count({ where }),
    ]);

    const data: RiskProfileWithStudent[] = profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      courseId: p.courseId,
      riskScore: p.riskScore,
      level: p.level,
      factors: p.factors as unknown as RiskFactors,
      calculatedAt: p.calculatedAt,
      alertSentAt: p.alertSentAt,
      student: p.user,
    }));

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByStudentAndCourse(
    userId: string,
    courseId: string,
  ): Promise<RiskProfile | null> {
    return prisma.riskProfile.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  }

  async getEnrolledStudents(courseId: string): Promise<string[]> {
    // Returns array of studentIds enrolled in a course
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      select: { studentId: true },
    });
    return enrollments.map((e) => e.studentId);
  }

  // ─── Data queries for factor calculation ──────────────────────────────────

  async getGradedSubmissions(userId: string, courseId: string) {
    return prisma.submission.findMany({
      where: {
        studentId: userId,
        status: { in: ["GRADED", "RETURNED"] },
        assignment: { courseId },
      },
      include: { assignment: { select: { maxScore: true } } },
    });
  }

  async getGradedAttempts(userId: string, courseId: string) {
    return prisma.quizAttempt.findMany({
      where: {
        studentId: userId,
        status: "GRADED",
        quiz: { courseId },
      },
      select: { score: true },
    });
  }

  async getDiscussionContributions(userId: string, courseId: string) {
    const [threads, posts] = await Promise.all([
      prisma.discussionThread.count({
        where: { authorId: userId, courseId, deletedAt: null },
      }),
      prisma.discussionPost.count({
        where: {
          authorId: userId,
          deletedAt: null,
          thread: { courseId },
        },
      }),
    ]);
    return threads + posts;
  }

  async getLessonCounts(userId: string, courseId: string) {
    const [total, completed] = await Promise.all([
      prisma.lesson.count({
        where: { module: { courseId, deletedAt: null }, deletedAt: null },
      }),
      prisma.lessonProgress.count({
        where: {
          userId,
          completed: true,
          lesson: { module: { courseId } },
        },
      }),
    ]);
    return { total, completed };
  }

  async getRecentActivityCount(
    userId: string,
    courseId: string,
    since: Date,
  ): Promise<number> {
    return prisma.activityEvent.count({
      where: { userId, courseId, occurredAt: { gte: since } },
    });
  }

  async markAlertSent(userId: string, courseId: string): Promise<void> {
    await prisma.riskProfile.update({
      where: { userId_courseId: { userId, courseId } },
      data: { alertSentAt: new Date() },
    });
  }
}