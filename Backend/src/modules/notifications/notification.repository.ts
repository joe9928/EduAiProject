// notification.repository.ts
import { Notification, Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import {
  CreateNotificationData,
  NotificationFilterDto,
} from "./notification.types";
import { PaginatedResult } from "../../common/types/pagination.types";

export class NotificationRepository {
  async findByUser(
    userId: string,
    filters: NotificationFilterDto,
  ): Promise<PaginatedResult<Notification>> {
    const { page, limit, isRead } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };
    if (isRead !== undefined) where.isRead = isRead;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({ where: { id } });
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return result.count;
  }

  async createNotification(
    userId: string,
    data: CreateNotificationData,
  ): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        body: data.body,
        metadata: data.metadata
          ? (data.metadata as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
  }
}
