// notification.types.ts
import { NotificationType, Prisma } from "@prisma/client";
import { PaginatedResult } from "../../common/types/pagination.types";

export { NotificationType };

export interface NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export interface NotificationFilterDto {
  page: number;
  limit: number;
  isRead?: boolean;
}

export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Prisma.InputJsonValue
}

export type NotificationPaginatedResult = PaginatedResult<NotificationDto>;