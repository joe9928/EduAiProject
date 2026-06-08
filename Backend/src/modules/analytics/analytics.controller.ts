import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "./analytics.service";
import { AuthenticatedRequest } from "../../common/types/request.types";
import { sendSuccess } from "../../common/utils/response.utils";

const analyticsService = new AnalyticsService();

export async function getStudentAnalytics(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const courseId = req.params.courseId as string;
    const result = await analyticsService.getStudentAnalytics(
      authReq.user.id,
      courseId,
      authReq.user.id,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getLecturerAnalytics(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const courseId = req.params.courseId as string;
    const result = await analyticsService.getLecturerAnalytics(
      courseId,
      authReq.user.id,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}