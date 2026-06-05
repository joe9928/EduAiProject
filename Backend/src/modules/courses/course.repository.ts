import { prisma } from "../../database/prisma.client";
import { CourseStatus } from "@prisma/client";
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseFilterDto,
  CreateModuleDto,
  CreateLessonDto,
  TrackProgressDto,
} from "./course.types";

export class CourseRepository {
  async create(data: CreateCourseDto, lecturerId: string) {
    // prisma.course.create
    // include lecturer: { select: { id, firstName, lastName } }

    return prisma.course.create({
      data: {
        ...data,
        lecturerId: lecturerId,
      },
      include: {
        lecturer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(filters: CourseFilterDto) {
    const { page = 1, limit = 20, status, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null }; // always exclude soft-deleted

    if (status) {
      where.status = status;
    }
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          lecturer: {
            select: { id: true, firstName: true, lastName: true },
          },
          _count: { select: { enrollments: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.course.findUnique({
      where: { id, deletedAt: null },
      include: {
        lecturer: {
          select: { id: true, firstName: true, lastName: true },
        },
        modules: {
          where: { deletedAt: null },
          include: {
            lessons: {
              where: { deletedAt: null },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateCourseDto) {
    // prisma.course.update

    return prisma.course.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: CourseStatus) {
    // prisma.course.update — just the status field
    return prisma.course.update({
      where: { id },
      data: { status },
    });
  }

  async getEnrollment(studentId: string, courseId: string) {
    // prisma.enrollment.findUnique
    // where: { studentId_courseId: { studentId, courseId } }
    return prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });
  }

  async createEnrollment(studentId: string, courseId: string) {
    // prisma.enrollment.create
    return prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
    });
  }

  async getEnrolledStudents(courseId: string) {
    // prisma.enrollment.findMany
    // where: { courseId }
    // include: { student: { select: id/email/firstName/lastName } }

    return prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async createModule(data: CreateModuleDto, courseId: string) {
    // prisma.courseModule.create
    return prisma.courseModule.create({
      data: {
        ...data,
        courseId, //link to parent course
      },
    });
  }

  async createLesson(data: CreateLessonDto, moduleId: string) {
    // prisma.lesson.create
    return prisma.lesson.create({
      data: {
        ...data,
        moduleId, //link to parent module
      },
    });
  }

  async trackProgress(
    userId: string,
    lessonId: string,
    data: TrackProgressDto,
  ) {
    // prisma.lessonProgress.upsert
    // where: { userId_lessonId: { userId, lessonId } }
    // update: completed, lastViewedAt, timeSpentSec increment
    // create: userId, lessonId, completed, timeSpentSec
    return prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          // Composite key
          userId,
          lessonId,
        },
      },
      create: {
        userId,
        lessonId,
        completed: data.completed,
        lastViewedAt: new Date(),
        timeSpentSec: data.timeSpentSec,
      },
      update: {
        completed: data.completed,
        lastViewedAt: new Date(),
        // Atomically increment the time spent
        timeSpentSec: {
          increment: data.timeSpentSec,
        },
      },
    });
  }
}
