import { NextFunction, Request, Response } from "express";
import { CourseService } from "./course.service";
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseFilterDto,
  TrackProgressDto,
  CreateModuleDto,
  CreateLessonDto,
} from "./course.types";
import { sendSuccess } from "../../common/utils/response.utils";
import { AuthenticatedRequest } from "../../common/types/request.types";

const courseService = new CourseService();

export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lecturerId = authReq.user.id;
    const dto: CreateCourseDto = {
      title: req.body.title,
      description: req.body.description,
      coverImageUrl: req.body.coverImageUrl,
    };
    const course = await courseService.create(dto, lecturerId);
    sendSuccess(res, course, 201);
  } catch (error) {
    next(error);
  }
}

export async function getCourses(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filters = (req as any).parsedQuery as CourseFilterDto;
    const result = await courseService.findAll(filters);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getCourseById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const course = await courseService.findById(id);
    sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
}

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lecturerId = authReq.user.id;
    const id = req.params.id as string;
    const dto: UpdateCourseDto = {
      title: req.body.title,
      description: req.body.description,
      coverImageUrl: req.body.coverImageUrl,
    };
    const updated = await courseService.update(id, dto, lecturerId);
    sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
}

export async function publishCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lecturerId = authReq.user.id;
    const id = req.params.id as string;
    const published = await courseService.publish(id, lecturerId);
    sendSuccess(res, published);
  } catch (error) {
    next(error);
  }
}

export async function archiveCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lecturerId = authReq.user.id;
    const id = req.params.id as string;
    const archived = await courseService.archive(id, lecturerId);
    sendSuccess(res, archived);
  } catch (error) {
    next(error);
  }
}

export async function enrollStudent(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const studentId = authReq.user.id;
    const courseId = req.params.courseId as string;
    const enrollment = await courseService.enroll(courseId, studentId);
    sendSuccess(res, enrollment, 201);
  } catch (error) {
    next(error);
  }
}

export async function getEnrolledStudents(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lecturerId = authReq.user.id;
    const courseId = req.params.courseId as string;
    const students = await courseService.getEnrolledStudents(courseId, lecturerId);
    sendSuccess(res, students);
  } catch (error) {
    next(error);
  }
}

export async function createModule(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lecturerId = authReq.user.id;
    const courseId = req.params.courseId as string;
    const dto: CreateModuleDto = {
      title: req.body.title,
      description: req.body.description,
      order: req.body.order,
    };
    const module = await courseService.createModule(dto, courseId, lecturerId);
    sendSuccess(res, module, 201);
  } catch (error) {
    next(error);
  }
}

export async function createLesson(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lecturerId = authReq.user.id;
    const courseId = req.params.courseId as string;
    const moduleId = req.params.moduleId as string;
    const lesson = await courseService.createLesson(
      req.body,
      moduleId,
      courseId,
      lecturerId,
    );
    sendSuccess(res, lesson, 201);
  } catch (error) {
    next(error);
  }
}

export async function trackProgress(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const lessonId = req.params.lessonId as string;
    const dto: TrackProgressDto = {
      completed: req.body.completed,
      timeSpentSec: req.body.timeSpentSec,
    };
    const progress = await courseService.trackProgress(lessonId, userId, dto);
    sendSuccess(res, progress);
  } catch (error) {
    next(error);
  }
}