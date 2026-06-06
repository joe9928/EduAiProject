import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../common/utils/response.utils";
import { QuizService } from "./quiz.service";
import { AuthenticatedRequest } from "../../common/types/request.types";
import { QuizFilterInput } from "./quiz.validation";

const quizService = new QuizService();

export async function createQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.createQuiz(req.body, courseId, authReq.user.id);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function getQuizzesByCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const filters = (req as any).parsedQuery as QuizFilterInput;
    const result = await quizService.getQuizzesByCourse(courseId, filters);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getQuizById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await quizService.getQuizById(id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function publishQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.publishQuiz(id, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function addQuestion(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const quizId = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.addQuestion(req.body, quizId, authReq.user.id);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function startAttempt(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const quizId = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.startAttempt(quizId, authReq.user.id);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function saveAnswer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const attemptId = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.saveAnswer(attemptId, req.body, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function submitAttempt(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const attemptId = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.submitAttempt(attemptId, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getAttemptResult(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const attemptId = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.getAttemptResult(attemptId, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function generateQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { topic, questionCount, courseId } = req.body;
    const result = await quizService.generateQuizFromMock(
      topic,
      questionCount,
      courseId,
      authReq.user.id,
    );
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}