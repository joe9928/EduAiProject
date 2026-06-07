import { RiskLevel } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import { RiskRepository } from "./risk.repository";
import { RiskFactors, RiskProfileDto, RiskPaginatedResult } from "./risk.types";
import { RiskFilterInput } from "./risk.validation";
import { NotFoundError, ForbiddenError } from "../../common/errors/app.error";

// Weights from LLD section 10.1
const WEIGHTS = {
  performance: 0.40,
  engagement: 0.30,
  completion: 0.20,
  activity:   0.10,
};

// Thresholds from LLD
const THRESHOLDS = {
  HIGH:   0.70,
  MEDIUM: 0.45,
};

// Expected engagement interactions per course
const EXPECTED_INTERACTIONS = 5;

// Expected activity events per 14-day window
const EXPECTED_ACTIVITY = 10;
const ACTIVITY_WINDOW_DAYS = 14;

export class RiskService {
  private repository: RiskRepository;

  constructor() {
    this.repository = new RiskRepository();
  }

  // ─── Public Methods ────────────────────────────────────────────────────────

  async calculateCourseRisk(courseId: string, lecturerId: string) {
    // Verify course exists and lecturer owns it
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    if (course.lecturerId !== lecturerId) throw new ForbiddenError("FORBIDDEN_OWNERSHIP");

    // Get all enrolled students
    const studentIds = await this.repository.getEnrolledStudents(courseId);

    // Calculate risk for every student in the course
    const results = await Promise.all(
      studentIds.map((studentId) =>
        this.calculateStudentRisk(studentId, courseId)
      ),
    );

    return { calculated: results.length, courseId };
  }

  async getCourseRiskProfiles(
    courseId: string,
    lecturerId: string,
    filters: RiskFilterInput,
  ): Promise<RiskPaginatedResult> {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    if (course.lecturerId !== lecturerId) throw new ForbiddenError("FORBIDDEN_OWNERSHIP");

    return this.repository.findByCourse(courseId, filters);
  }

  async getStudentRiskProfile(
    studentId: string,
    courseId: string,
    requesterId: string,
    requesterRole: string,
  ) {
    // Student can view their own profile
    // Lecturer can view any student in their course
    const isOwnProfile = studentId === requesterId;
    const isLecturer = requesterRole === "LECTURER" || requesterRole === "ADMINISTRATOR";

    if (!isOwnProfile && !isLecturer) {
      throw new ForbiddenError("FORBIDDEN");
    }

    const profile = await this.repository.findByStudentAndCourse(studentId, courseId);
    if (!profile) {
      throw new NotFoundError("Risk profile not found", "RISK_PROFILE_NOT_FOUND");
    }

    return profile;
  }

  // ─── Core Algorithm ────────────────────────────────────────────────────────

  async calculateStudentRisk(studentId: string, courseId: string) {
    const factors = await this.computeFactors(studentId, courseId);

    // Weighted sum of all factors
    const riskScore =
      WEIGHTS.performance * factors.performanceFactor +
      WEIGHTS.engagement  * factors.engagementFactor +
      WEIGHTS.completion  * factors.completionFactor +
      WEIGHTS.activity    * factors.activityFactor;

    // Clamp to [0, 1] to handle floating point edge cases
    const clampedScore = Math.min(1, Math.max(0, riskScore));

    const level = this.classifyRisk(clampedScore);

    // Persist the result — upsert so re-running is safe
    const profile = await this.repository.upsertRiskProfile(
      studentId,
      courseId,
      clampedScore,
      level,
      factors,
    );

    // Send alert notification for HIGH risk students
    // with 48-hour debounce to prevent spam
    if (level === RiskLevel.HIGH) {
      await this.sendAlertIfNeeded(studentId, courseId, profile.alertSentAt);
    }

    return profile;
  }

  // ─── Factor Computation ────────────────────────────────────────────────────

  private async computeFactors(
    userId: string,
    courseId: string,
  ): Promise<RiskFactors> {
    // Run all four data fetches in parallel for performance
    const [
      submissions,
      attempts,
      contributions,
      lessonCounts,
      activityCount,
    ] = await Promise.all([
      this.repository.getGradedSubmissions(userId, courseId),
      this.repository.getGradedAttempts(userId, courseId),
      this.repository.getDiscussionContributions(userId, courseId),
      this.repository.getLessonCounts(userId, courseId),
      this.repository.getRecentActivityCount(
        userId,
        courseId,
        this.getActivityWindowStart(),
      ),
    ]);

    return {
      performanceFactor: this.computePerformanceFactor(submissions, attempts),
      engagementFactor:  this.computeEngagementFactor(contributions),
      completionFactor:  this.computeCompletionFactor(lessonCounts),
      activityFactor:    this.computeActivityFactor(activityCount),
    };
  }

  private computePerformanceFactor(
    submissions: Array<{ score: number | null; assignment: { maxScore: number } }>,
    attempts: Array<{ score: number | null }>,
  ): number {
    const scores: number[] = [];

    // Assignment scores — normalize to 0-1
    for (const sub of submissions) {
      if (sub.score !== null && sub.assignment.maxScore > 0) {
        scores.push(sub.score / sub.assignment.maxScore);
      }
    }

    // Quiz scores — already stored as percentage (0-100), normalize to 0-1
    for (const attempt of attempts) {
      if (attempt.score !== null) {
        scores.push(attempt.score / 100);
      }
    }

    // No graded work yet — no risk signal, return 0
    if (scores.length === 0) return 0;

    const avgPerformance = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Invert — low performance = high risk
    return 1 - avgPerformance;
  }

  private computeEngagementFactor(contributions: number): number {
    if (contributions === 0) return 1; // No participation = maximum risk

    const engagementRate = Math.min(contributions / EXPECTED_INTERACTIONS, 1);

    // Invert — low engagement = high risk
    return 1 - engagementRate;
  }

  private computeCompletionFactor(lessonCounts: {
    total: number;
    completed: number;
  }): number {
    if (lessonCounts.total === 0) return 0; // No lessons in course — no signal

    const completionRate = lessonCounts.completed / lessonCounts.total;

    // Invert — low completion = high risk
    return 1 - completionRate;
  }

  private computeActivityFactor(activityCount: number): number {
    if (activityCount === 0) return 1; // Zero activity = maximum risk

    const activityRate = Math.min(activityCount / EXPECTED_ACTIVITY, 1);

    // Invert — low activity = high risk
    return 1 - activityRate;
  }

  // ─── Classification ────────────────────────────────────────────────────────

  private classifyRisk(score: number): RiskLevel {
    if (score >= THRESHOLDS.HIGH)   return RiskLevel.HIGH;
    if (score >= THRESHOLDS.MEDIUM) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  // ─── Alert Debouncing ─────────────────────────────────────────────────────

  private async sendAlertIfNeeded(
    userId: string,
    courseId: string,
    lastAlertSentAt: Date | null,
  ): Promise<void> {
    const DEBOUNCE_HOURS = 48;
    const now = new Date();

    if (lastAlertSentAt) {
      const hoursSinceLast =
        (now.getTime() - lastAlertSentAt.getTime()) / (1000 * 60 * 60);

      // Skip if alert was sent within debounce window
      if (hoursSinceLast < DEBOUNCE_HOURS) return;
    }

    // In the full implementation this would trigger a notification
    // via the NotificationService and potentially an email
    // For now we just record that the alert was sent
    await this.repository.markAlertSent(userId, courseId);
  }

  private getActivityWindowStart(): Date {
    const date = new Date();
    date.setDate(date.getDate() - ACTIVITY_WINDOW_DAYS);
    return date;
  }
}