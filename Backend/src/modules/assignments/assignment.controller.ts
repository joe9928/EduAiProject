import { Request, Response, NextFunction } from "express";
import { AssignmentService } from "./assignment.service";
import { AuthenticatedRequest } from "../../common/types/request.types";
import { sendSuccess } from "../../common/utils/response.utils";
import { NotFoundError } from "../../common/errors/app.error";

const assignmentService = new AssignmentService();

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const courseId = req.params.courseId as string;
    const assignment = await assignmentService.createAssignment(
      req.body,
      courseId,
      authReq.user.id,
    );
    sendSuccess(res, assignment, 201);
  } catch (error) {
    next(error);
  }
}

export async function getAssignmentsByCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const result = await assignmentService.getAssignmentsByCourse(
      courseId,
      (req as any).parsedQuery,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const assignment = await assignmentService.getAssignment(id);
    sendSuccess(res, assignment);
  } catch (error) {
    next(error);
  }
}

export async function submitAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const assignmentId = req.params.id as string;
    const submission = await assignmentService.submitAssignment(
      assignmentId,
      authReq.user.id,
      req.body,
    );
    sendSuccess(res, submission, 201);
  } catch (error) {
    next(error);
  }
}

export async function getMySubmission(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const assignmentId = req.params.id as string;
    const submission = await assignmentService.getStudentSubmission(
      assignmentId,
      authReq.user.id,
    );
    if (!submission) {
      throw new NotFoundError("No submission found", "SUBMISSION_NOT_FOUND");
    }
    sendSuccess(res, submission);
  } catch (error) {
    next(error);
  }
}

export async function gradeSubmission(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const submissionId = req.params.id as string;
    const submission = await assignmentService.gradeSubmission(
      submissionId,
      req.body,
      authReq.user.id,
    );
    sendSuccess(res, submission);
  } catch (error) {
    next(error);
  }
}

export async function getSubmissions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const assignmentId = req.params.id as string;
    const result = await assignmentService.getSubmissionsByAssignment(
      assignmentId,
      authReq.user.id,
      (req as any).parsedQuery,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}