import { RecommendationType } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import { RecommendationRepository } from "./recommendation.repository";
import { RecommendationFilterInput } from "./recommendation.validation";
import { NotFoundError, ForbiddenError } from "../../common/errors/app.error";
import { RecommendationPaginatedResult } from "./recommendation.types";

export class RecommendationService {
  private repository: RecommendationRepository;

  constructor() {
    this.repository = new RecommendationRepository();
  }

  // ─── Public Methods ────────────────────────────────────────────────────────

  async getMyRecommendations(
    userId: string,
    filters: RecommendationFilterInput,
  ): Promise<RecommendationPaginatedResult> {
    return this.repository.findByUser(userId, filters);
  }

  async dismiss(recommendationId: string, userId: string) {
    const rec = await this.repository.findById(recommendationId);
    if (!rec) {
      throw new NotFoundError("Recommendation not found", "RECOMMENDATION_NOT_FOUND");
    }
    if (rec.userId !== userId) {
      throw new ForbiddenError("FORBIDDEN");
    }
    return this.repository.dismiss(recommendationId);
  }

  async generateForUser(userId: string) {
    // Step 1 — clean up stale recommendations before generating new ones
    const deleted = await this.repository.deleteExpired(userId);

    // Step 2 — find all courses the user is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      select: { courseId: true },
    });

    let created = 0;

    for (const { courseId } of enrollments) {
      const count = await this.generateForCourse(userId, courseId);
      created += count;
    }

    return { created, deletedExpired: deleted };
  }

  // ─── Generation Logic ─────────────────────────────────────────────────────

  private async generateForCourse(
    userId: string,
    courseId: string,
  ): Promise<number> {
    let count = 0;

    count += await this.checkWeakTopics(userId, courseId);
    count += await this.checkUnstartedQuizzes(userId, courseId);
    count += await this.checkMissedContent(userId, courseId);
    count += await this.checkUpcomingDeadlines(userId, courseId);
    count += await this.checkPeerDiscussion(userId, courseId);

    return count;
  }

  // ─── Check 1: WEAK_TOPIC_REVISION ─────────────────────────────────────────

  private async checkWeakTopics(userId: string, courseId: string) {
    // Find quizzes where the student's best score is below the passing threshold
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        studentId: userId,
        status: "GRADED",
        quiz: { courseId },
      },
      include: { quiz: { select: { id: true, title: true, passingScore: true } } },
      orderBy: { score: "desc" },
    });

    let created = 0;

    // Group by quiz — take the best attempt per quiz
    const bestByQuiz = new Map<string, typeof attempts[0]>();
    for (const attempt of attempts) {
      const existing = bestByQuiz.get(attempt.quizId);
      if (!existing || (attempt.score ?? 0) > (existing.score ?? 0)) {
        bestByQuiz.set(attempt.quizId, attempt);
      }
    }

    for (const [quizId, attempt] of bestByQuiz) {
      const score = attempt.score ?? 0;
      if (score < attempt.quiz.passingScore) {
        // Skip if recommendation already exists and is not dismissed
        const existing = await this.repository.findExisting(userId, quizId);
        if (existing) continue;

        // Priority = how far below passing they are
        const priority = (attempt.quiz.passingScore - score) / 100;

        await this.repository.createRecommendation(userId, {
          type: RecommendationType.WEAK_TOPIC_REVISION,
          resourceType: "Quiz",
          resourceId: quizId,
          reason: `You scored ${score}% on "${attempt.quiz.title}" — below the passing score of ${attempt.quiz.passingScore}%. Review this topic.`,
          score: Math.min(1, priority),
          expiresAt: this.daysFromNow(7),
        });
        created++;
      }
    }

    return created;
  }

  // ─── Check 2: PRACTICE_QUIZ ───────────────────────────────────────────────

  private async checkUnstartedQuizzes(userId: string, courseId: string) {
    // Find published quizzes in the course with no attempts by this student
    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId,
        status: "PUBLISHED",
        attempts: { none: { studentId: userId } },
      },
      select: { id: true, title: true },
    });

    let created = 0;

    for (const quiz of quizzes) {
      const existing = await this.repository.findExisting(userId, quiz.id);
      if (existing) continue;

      await this.repository.createRecommendation(userId, {
        type: RecommendationType.PRACTICE_QUIZ,
        resourceType: "Quiz",
        resourceId: quiz.id,
        reason: `You haven't attempted "${quiz.title}" yet. Practice quizzes help reinforce your learning.`,
        score: 0.6,
        expiresAt: this.daysFromNow(30),
      });
      created++;
    }

    return created;
  }

  // ─── Check 3: MISSED_CONTENT ──────────────────────────────────────────────

  private async checkMissedContent(userId: string, courseId: string) {
    // Find lessons with no progress record or progress.completed = false
    const incompleteLessons = await prisma.lesson.findMany({
      where: {
        deletedAt: null,
        module: { courseId, deletedAt: null },
        OR: [
          { progress: { none: { userId } } },
          { progress: { some: { userId, completed: false } } },
        ],
      },
      select: { id: true, title: true },
      take: 5, // Cap at 5 to avoid overwhelming the student
    });

    let created = 0;

    for (const lesson of incompleteLessons) {
      const existing = await this.repository.findExisting(userId, lesson.id);
      if (existing) continue;

      await this.repository.createRecommendation(userId, {
        type: RecommendationType.MISSED_CONTENT,
        resourceType: "Lesson",
        resourceId: lesson.id,
        reason: `You haven't completed "${lesson.title}" yet. Completing all lessons builds a strong foundation.`,
        score: 0.5,
        expiresAt: this.daysFromNow(14),
      });
      created++;
    }

    return created;
  }

  // ─── Check 4: UPCOMING_DEADLINE ───────────────────────────────────────────

  private async checkUpcomingDeadlines(userId: string, courseId: string) {
    const now = new Date();
    const sevenDaysFromNow = this.daysFromNow(7);

    // Find assignments due within 7 days with no submission from this student
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId,
        deletedAt: null,
        dueDate: { gte: now, lte: sevenDaysFromNow },
        submissions: { none: { studentId: userId } },
      },
      select: { id: true, title: true, dueDate: true },
    });

    let created = 0;

    for (const assignment of assignments) {
      const existing = await this.repository.findExisting(userId, assignment.id);
      if (existing) continue;

      // Closer deadline = higher priority score
      const daysUntilDue =
        (assignment.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const priority = 1 - daysUntilDue / 7;

      await this.repository.createRecommendation(userId, {
        type: RecommendationType.UPCOMING_DEADLINE,
        resourceType: "Assignment",
        resourceId: assignment.id,
        reason: `"${assignment.title}" is due in ${Math.ceil(daysUntilDue)} day(s). Submit before the deadline.`,
        score: Math.min(1, Math.max(0, priority)),
        expiresAt: assignment.dueDate,
      });
      created++;
    }

    return created;
  }

  // ─── Check 5: PEER_DISCUSSION ─────────────────────────────────────────────

  private async checkPeerDiscussion(userId: string, courseId: string) {
    // Check if student has zero discussion contributions in this course
    const [threads, posts] = await Promise.all([
      prisma.discussionThread.count({
        where: { authorId: userId, courseId, deletedAt: null },
      }),
      prisma.discussionPost.count({
        where: { authorId: userId, deletedAt: null, thread: { courseId } },
      }),
    ]);

    if (threads + posts > 0) return 0; // Already engaging

    // Use courseId as resourceId since recommendation is course-scoped
    const existing = await this.repository.findExisting(userId, courseId);
    if (existing) return 0;

    await this.repository.createRecommendation(userId, {
      type: RecommendationType.PEER_DISCUSSION,
      resourceType: "Course",
      resourceId: courseId,
      reason: "You haven't participated in any discussions yet. Engaging with peers improves understanding and retention.",
      score: 0.4,
      expiresAt: this.daysFromNow(14),
    });

    return 1;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private daysFromNow(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}