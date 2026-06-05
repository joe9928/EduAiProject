import { CourseStatus } from "@prisma/client";
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseFilterDto,
  EnrollResponseDto,
  CreateModuleDto,
  CreateLessonDto,
  TrackProgressDto,
  PaginatedResult,
} from "./course.types";
import { CourseRepository } from "./course.repository";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../common/errors/app.error";

export class CourseService {
  private repository: CourseRepository;

  constructor() {
    this.repository = new CourseRepository();
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private async assertOwnership(courseId: string, lecturerId: string) {
    const course = await this.repository.findById(courseId);
    if (!course) throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    if (course.lecturerId !== lecturerId) {
      throw new ForbiddenError("FORBIDDEN_OWNERSHIP");
    }
    return course;
  }

  // ─── Public Methods ──────────────────────────────────────────────────────────

  async create(dto: CreateCourseDto, lecturerId: string) {
    return this.repository.create(dto, lecturerId);
  }

  async findAll(filters: CourseFilterDto): Promise<PaginatedResult<any>> {
    return this.repository.findAll(filters);
  }

  async findById(id: string) {
    const course = await this.repository.findById(id);
    if (!course) throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, lecturerId: string) {
    // assertOwnership checks existence + ownership in one call
    await this.assertOwnership(id, lecturerId);
    return this.repository.update(id, dto);
  }

  async publish(id: string, lecturerId: string) {
    const course = await this.assertOwnership(id, lecturerId);

    if (course.status !== CourseStatus.DRAFT) {
      throw new ConflictError(
        "Only DRAFT courses can be published",
        "COURSE_NOT_DRAFT"
      );
    }

    return this.repository.updateStatus(id, CourseStatus.PUBLISHED);
  }

  async archive(id: string, lecturerId: string) {
    const course = await this.assertOwnership(id, lecturerId);

    if (course.status === CourseStatus.ARCHIVED) {
      throw new ConflictError(
        "Course is already archived",
        "COURSE_ALREADY_ARCHIVED"
      );
    }

    return this.repository.updateStatus(id, CourseStatus.ARCHIVED);
  }

  async enroll(courseId: string, studentId: string): Promise<EnrollResponseDto> {
    // 1. Course must exist and be PUBLISHED
    const course = await this.repository.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    }
    if (course.status !== CourseStatus.PUBLISHED) {
      throw new ConflictError(
        "You can only enroll in published courses",
        "COURSE_NOT_PUBLISHED"
      );
    }

    // 2. Student cannot be the course lecturer
    if (course.lecturerId === studentId) {
      throw new ForbiddenError("Lecturers cannot enroll in their own courses");
    }

    // 3. Prevent duplicate enrollment
    const existing = await this.repository.getEnrollment(studentId, courseId);
    if (existing) {
      throw new ConflictError(
        "You are already enrolled in this course",
        "ENROLLMENT_DUPLICATE"
      );
    }

    // 4. Create enrollment
    const enrollment = await this.repository.createEnrollment(studentId, courseId);
    return {
      id: enrollment.id,
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      enrolledAt: enrollment.enrolledAt,
    };
  }

  async getEnrolledStudents(courseId: string, lecturerId: string) {
    await this.assertOwnership(courseId, lecturerId);
    return this.repository.getEnrolledStudents(courseId);
  }

  async createModule(dto: CreateModuleDto, courseId: string, lecturerId: string) {
    await this.assertOwnership(courseId, lecturerId);
    return this.repository.createModule(dto, courseId);
  }

  async createLesson(
    dto: CreateLessonDto,
    moduleId: string,
    courseId: string,
    lecturerId: string
  ) {
    await this.assertOwnership(courseId, lecturerId);
    return this.repository.createLesson(dto, moduleId);
  }

  async trackProgress(lessonId: string, userId: string, dto: TrackProgressDto) {
    return this.repository.trackProgress(userId, lessonId, dto);
  }
}