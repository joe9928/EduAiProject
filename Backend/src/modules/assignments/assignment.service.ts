import { Assignment, Submission, SubmissionStatus } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import { AssignmentRepository } from "./assignment.repository";
import {
  CreateAssignmentDto,
  SubmitAssignmentDto,
  GradeSubmissionDto,
  AssignmentResponseDto,
  SubmissionResponseDto,
  AssignmentPaginatedResult,
} from "./assignment.types";
import {
  CreateAssignmentInput,
  SubmitAssignmentInput,
  GradeSubmissionInput,
  AssignmentFilterInput,
  SubmissionFilterInput,
} from "./assignment.validation";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../../common/errors/app.error";
import { PaginatedResult } from "../../common/types/pagination.types";

export class AssignmentService {
  private repository: AssignmentRepository;

  constructor() {
    this.repository = new AssignmentRepository();
  }

  async createAssignment(
    dto: CreateAssignmentInput,
    courseId: string,
    lecturerId: string,
  ): Promise<AssignmentResponseDto> {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    if (course.lecturerId !== lecturerId) throw new ForbiddenError("FORBIDDEN_OWNERSHIP");
    return this.repository.create(dto, courseId);
  }

  async getAssignmentsByCourse(
    courseId: string,
    filters: AssignmentFilterInput,
  ): Promise<AssignmentPaginatedResult> {
    return this.repository.findByCourse(courseId, filters);
  }

  async getAssignment(id: string): Promise<Assignment> {
    const assignment = await this.repository.findById(id);
    if (!assignment) throw new NotFoundError("Assignment not found", "ASSIGNMENT_NOT_FOUND");
    return assignment;
  }

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    dto: SubmitAssignmentInput,
  ): Promise<Submission> {
    // Rule 3 — content required (Zod handles this but double-check here)
    if (!dto.fileUrl && !dto.textContent) {
      throw new ConflictError(
        "Either fileUrl or textContent is required",
        "SUBMISSION_CONTENT_REQUIRED",
      );
    }

    // Fetch assignment
    const assignment = await this.repository.findById(assignmentId);
    if (!assignment) {
      throw new NotFoundError("Assignment not found", "ASSIGNMENT_NOT_FOUND");
    }

    // Rule 1 — deadline enforcement
    const now = new Date();
    const isLate = now > assignment.dueDate;

    if (isLate && !assignment.allowLate) {
      throw new ConflictError(
        "Submission deadline has passed",
        "SUBMISSION_PAST_DEADLINE",
      );
    }

    const status: SubmissionStatus =
      isLate && assignment.allowLate
        ? SubmissionStatus.LATE
        : SubmissionStatus.SUBMITTED;

    // Rule 2 — idempotent submission
    const existing = await this.repository.findSubmission(assignmentId, studentId);

    if (!existing) {
      return this.repository.createSubmission(assignmentId, studentId, dto, status);
    }

    if (existing.status === SubmissionStatus.GRADED) {
      throw new ConflictError(
        "This submission has already been graded",
        "SUBMISSION_ALREADY_GRADED",
      );
    }

    return this.repository.updateSubmission(existing.id, dto, status);
  }

  async getStudentSubmission(
    assignmentId: string,
    studentId: string,
  ): Promise<Submission | null> {
    return this.repository.findSubmission(assignmentId, studentId);
  }

  async gradeSubmission(
    submissionId: string,
    dto: GradeSubmissionInput,
    lecturerId: string,
  ): Promise<Submission> {
    // Use repository — not direct Prisma
    const submission = await this.repository.findSubmissionById(submissionId);
    if (!submission) {
      throw new NotFoundError("Submission not found", "SUBMISSION_NOT_FOUND");
    }

    if (submission.status === SubmissionStatus.GRADED) {
      throw new ConflictError(
        "Submission already graded",
        "SUBMISSION_ALREADY_GRADED",
      );
    }

    const assignment = await this.repository.findById(submission.assignmentId);
    if (!assignment) {
      throw new NotFoundError("Assignment not found", "ASSIGNMENT_NOT_FOUND");
    }

    // Validate score ceiling
    if (dto.score > assignment.maxScore) {
      throw new ConflictError(
        `Score ${dto.score} exceeds maximum score of ${assignment.maxScore}`,
        "SUBMISSION_SCORE_EXCEEDS_MAX",
      );
    }

    // Rule 4 — audit log
    await prisma.auditLog.create({
      data: {
        actorId: lecturerId,
        action: "GRADE_SUBMISSION",
        targetType: "Submission",
        targetId: submissionId,
        previousState: { status: submission.status, score: submission.score },
        newState: { status: SubmissionStatus.GRADED, score: dto.score },
      },
    });

    return this.repository.grade(submissionId, dto, lecturerId);
  }

  async getSubmissionsByAssignment(
    assignmentId: string,
    lecturerId: string,
    filters: SubmissionFilterInput,
  ): Promise<PaginatedResult<Submission>> {
    const assignment = await this.repository.findById(assignmentId);
    if (!assignment) {
      throw new NotFoundError("Assignment not found", "ASSIGNMENT_NOT_FOUND");
    }

    // Verify lecturer owns the course this assignment belongs to
    const course = await prisma.course.findUnique({
      where: { id: assignment.courseId },
    });
    if (!course || course.lecturerId !== lecturerId) {
      throw new ForbiddenError("FORBIDDEN_OWNERSHIP");
    }

    return this.repository.getSubmissions(assignmentId, filters);
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private toAssignmentResponse(assignment: Assignment): AssignmentResponseDto {
    return {
      id: assignment.id,
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      allowLate: assignment.allowLate,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    };
  }
}