import { z } from "zod";
import { RiskLevel } from "@prisma/client";

export const riskFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  level: z.nativeEnum(RiskLevel).optional(),
});

export type RiskFilterInput = z.infer<typeof riskFilterSchema>;