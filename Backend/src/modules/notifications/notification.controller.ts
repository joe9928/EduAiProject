// notification.controller.ts
import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service";
import { AuthenticatedRequest } from "../../common/types/request.types";
import { sendSuccess } from "../../common/utils/response.utils";
import { NotificationFilterDto } from "./notification.types";

const notificationService = new NotificationService();

export async function getMyNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const filters: NotificationFilterDto = (req as any).parsedQuery;
    const result = await notificationService.getMyNotifications(authReq.user.id, filters);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const result = await notificationService.markAsRead(id, authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await notificationService.markAllAsRead(authReq.user.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}