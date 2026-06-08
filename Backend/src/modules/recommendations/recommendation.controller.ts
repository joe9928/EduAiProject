import { Request, Response, NextFunction } from "express";
import { RecommendationService } from "./recommendation.service";
import { AuthenticatedRequest } from "../../common/types/request.types";
import { sendSuccess } from "../../common/utils/response.utils";
import { RecommendationFilterInput } from "./recommendation.validation";

const recommendationService = new RecommendationService();

export async function getMyRecommendations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const filters = (req as any).parsedQuery as RecommendationFilterInput;
    const result = await recommendationService.getMyRecommendations(
      authReq.user.id,
      filters,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function dismissRecommendation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const result = await recommendationService.dismiss(id, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function generateRecommendations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await recommendationService.generateForUser(authReq.user.id);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}