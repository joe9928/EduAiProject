import {
  Assignment,
  Submission,
  SubmissionStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import {
  CreateAssignmentDto,
  SubmitAssignmentDto,
  GradeSubmissionDto,
  AssignmentListItemDto,
  AssignmentResponseDto,
  SubmissionResponseDto,
  AssignmentPaginatedResult,
} from "./assignment.types";
import {
  AssignmentFilterInput,
  SubmissionFilterInput,
} from "./assignment.validation";
import { PaginatedResult } from "../../common/types/pagination.types";

export class AssignmentRepository {
  async create(
    dto: CreateAssignmentDto,
    courseId: string,
  ): Promise<AssignmentResponseDto> {
    const assignment = await prisma.assignment.create({
      data: {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate,
        maxScore: dto.maxScore,
        allowLate: dto.allowLate,
        courseId,
      },
    });
    return this.toAssignmentResponse(assignment);
  }

  async findByCourse(
    courseId: string,
    filters: AssignmentFilterInput,
  ): Promise<AssignmentPaginatedResult> {
    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        where: { courseId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { dueDate: "asc" },
      }),
      prisma.assignment.count({
        where: { courseId, deletedAt: null },
      }),
    ]);

    const data: AssignmentListItemDto[] = assignments.map((a) => ({
      id: a.id,
      title: a.title,
      dueDate: a.dueDate,
      maxScore: a.maxScore,
      allowLate: a.allowLate,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Assignment | null> {
    return prisma.assignment.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByIdAndCourse(
    id: string,
    courseId: string,
  ): Promise<Assignment | null> {
    return prisma.assignment.findFirst({
      where: { id, courseId, deletedAt: null },
    });
  }

  async findSubmission(
    assignmentId: string,
    studentId: string,
  ): Promise<Submission | null> {
    return prisma.submission.findUnique({
      where: {
        assignmentId_studentId: { assignmentId, studentId },
      },
    });
  }

  async createSubmission(
    assignmentId: string,
    studentId: string,
    dto: SubmitAssignmentDto,
    status: SubmissionStatus,
  ): Promise<Submission> {
    return prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        fileUrl: dto.fileUrl ?? null,
        textContent: dto.textContent ?? null,
        status,
        submittedAt: new Date(),
      },
    });
  }

  async updateSubmission(
    submissionId: string,
    dto: SubmitAssignmentDto,
    status: SubmissionStatus,
  ): Promise<Submission> {
    return prisma.submission.update({
      where: { id: submissionId },
      data: {
        fileUrl: dto.fileUrl ?? undefined,
        textContent: dto.textContent ?? undefined,
        status,
        submittedAt: new Date(),
      },
    });
  }

  async grade(
    submissionId: string,
    dto: GradeSubmissionDto,
    lecturerId: string,
  ): Promise<Submission> {
    return prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: dto.score,
        feedback: dto.feedback ?? null,
        gradedAt: new Date(),
        gradedById: lecturerId,
        status: SubmissionStatus.GRADED,
      },
    });
  }

  async getSubmissions(
    assignmentId: string,
    filters: SubmissionFilterInput,
  ): Promise<PaginatedResult<Submission>> {
    const { page, limit, status } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.SubmissionWhereInput = { assignmentId };
    if (status) where.status = status;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: "desc" },
      }),
      prisma.submission.count({ where }),
    ]);

    return {
      data: submissions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findSubmissionById(id: string): Promise<Submission | null> {
    return prisma.submission.findUnique({ where: { id } });
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

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
