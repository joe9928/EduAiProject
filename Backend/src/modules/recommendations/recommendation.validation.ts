import { RecommendationType } from "@prisma/client";
import { z } from "zod";

export const recommendationFilterSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  isDismissed: z.coerce
    .boolean()
    .optional(),
});

export const createRecommendationSchema = z.object({
  type: z.nativeEnum(RecommendationType),

  resourceType: z
    .string()
    .trim()
    .min(1)
    .max(100),

  resourceId: z
    .string()
    .trim()
    .uuid(),

  reason: z
    .string()
    .trim()
    .min(5)
    .max(500),

  score: z
    .number()
    .min(0)
    .max(1),

  expiresAt: z.coerce.date(),
});

export type RecommendationFilterInput = z.infer<
  typeof recommendationFilterSchema
>;

export type CreateRecommendationInput = z.infer<
  typeof createRecommendationSchema
>;