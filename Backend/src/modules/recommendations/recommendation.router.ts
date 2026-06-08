import { Router } from "express";
import { authenticate } from "../../common/middleware/jwt.middleware";
import { validateQuery } from "../../common/middleware/validate.middleware";
import { recommendationFilterSchema } from "./recommendation.validation";
import {
  getMyRecommendations,
  dismissRecommendation,
  generateRecommendations,
} from "./recommendation.controller";

const router = Router();

// Static routes before dynamic — /generate must come before /:id/dismiss
router.post("/recommendations/generate", authenticate, generateRecommendations);

router.get(
  "/recommendations",
  authenticate,
  validateQuery(recommendationFilterSchema),
  getMyRecommendations,
);

router.post("/recommendations/:id/dismiss", authenticate, dismissRecommendation);

export default router;