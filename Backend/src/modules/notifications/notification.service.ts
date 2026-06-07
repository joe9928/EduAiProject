// notification.service.ts
import { Notification } from "@prisma/client";
import { NotificationRepository } from "./notification.repository";
import {
  CreateNotificationData,
  NotificationFilterDto,
  NotificationPaginatedResult,
} from "./notification.types";
import { NotFoundError, ForbiddenError } from "../../common/errors/app.error";
import { PaginatedResult } from "../../common/types/pagination.types";

export class NotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  async getMyNotifications(
    userId: string,
    filters: NotificationFilterDto,
  ): Promise<PaginatedResult<Notification>> {
    return this.repository.findByUser(userId, filters);
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.repository.findById(notificationId);
    if (!notification) {
      throw new NotFoundError("Notification not found", "NOTIFICATION_NOT_FOUND");
    }

    // Ownership check — you can only mark your own notifications as read
    if (notification.userId !== userId) {
      throw new ForbiddenError("FORBIDDEN");
    }

    // Idempotent — already read, return as-is
    if (notification.isRead) return notification;

    return this.repository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<{ updatedCount: number }> {
    const updatedCount = await this.repository.markAllAsRead(userId);
    return { updatedCount };
  }

  // Called by other services internally — not exposed via HTTP directly
  async createNotification(
    userId: string,
    data: CreateNotificationData,
  ): Promise<Notification> {
    return this.repository.createNotification(userId, data);
  }
}