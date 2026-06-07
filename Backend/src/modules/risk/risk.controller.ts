import { Request, Response, NextFunction } from "express";
import { RiskService } from "./risk.service";
import { AuthenticatedRequest } from "../../common/types/request.types";
import { sendSuccess } from "../../common/utils/response.utils";
import { RiskFilterInput } from "./risk.validation";

const riskService = new RiskService();

export async function calculateCourseRisk(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const courseId = req.params.courseId as string;
    const result = await riskService.calculateCourseRisk(courseId, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getCourseRiskProfiles(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const courseId = req.params.courseId as string;
    const filters = (req as any).parsedQuery as RiskFilterInput;
    const result = await riskService.getCourseRiskProfiles(
      courseId,
      authReq.user.id,
      filters,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getStudentRiskProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const studentId = req.params.studentId as string;
    const courseId = req.params.courseId as string;
    const result = await riskService.getStudentRiskProfile(
      studentId,
      courseId,
      authReq.user.id,
      authReq.user.role,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}