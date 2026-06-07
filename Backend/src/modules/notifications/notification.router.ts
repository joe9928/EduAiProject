// notification.router.ts
import { Router } from "express";
import { authenticate } from "../../common/middleware/jwt.middleware";
import { validateQuery } from "../../common/middleware/validate.middleware";
import { notificationFilterSchema } from "./notification.validation";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.controller";

const router = Router();

// Static route MUST come before dynamic /:id route
router.patch("/notifications/read-all", authenticate, markAllAsRead);

router.get(
  "/notifications",
  authenticate,
  validateQuery(notificationFilterSchema),
  getMyNotifications,
);

router.patch("/notifications/:id/read", authenticate, markAsRead);

export default router;