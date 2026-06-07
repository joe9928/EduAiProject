import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../common/utils/response.utils";
import { DiscussionService } from "./discussion.service";
import { AuthenticatedRequest } from "../../common/types/request.types";
import {
  CreateThreadInput,
  CreatePostInput,
  UpdateThreadInput,
  UpdatePostInput,
  ModerateThreadInput,
  ThreadFilterInput,
} from "./discussion.validation";

const discussionService = new DiscussionService();

export async function createThread(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const courseId = req.params.courseId as string;
    const thread = await discussionService.createThread(req.body, courseId, authReq.user.id);
    sendSuccess(res, thread, 201);
  } catch (error) {
    next(error);
  }
}

export async function getThreads(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const filters = (req as any).parsedQuery as ThreadFilterInput;
    const result = await discussionService.getThreadsByCourse(courseId, filters);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getThread(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const thread = await discussionService.getThreadById(id);
    sendSuccess(res, thread);
  } catch (error) {
    next(error);
  }
}

export async function updateThread(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const result = await discussionService.updateThread(id, req.body, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function moderateThread(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const result = await discussionService.moderateThread(
      id,
      req.body,
      authReq.user.id,
      authReq.user.role,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function deleteThread(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const result = await discussionService.deleteThread(
      id,
      authReq.user.id,
      authReq.user.role,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const threadId = req.params.id as string;
    const post = await discussionService.createPost(req.body, threadId, authReq.user.id);
    sendSuccess(res, post, 201);
  } catch (error) {
    next(error);
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const result = await discussionService.updatePost(id, req.body, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const result = await discussionService.deletePost(
      id,
      authReq.user.id,
      authReq.user.role,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}