// notification.validation.ts
import { z } from "zod";

export const notificationFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isRead: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

export type NotificationFilterInput = z.infer<typeof notificationFilterSchema>;
