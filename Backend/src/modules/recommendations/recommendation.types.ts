import { RecommendationType } from "@prisma/client";
import { PaginatedResult } from "../../common/types/pagination.types";



export interface RecommendationDto {
  id: string;
  type: RecommendationType;
  resourceType: string;
  resourceId: string;
  reason: string;
  score: number;
  isDismissed: boolean;
  isActedOn: boolean;
  generatedAt: Date;
  expiresAt: Date;
}

export interface RecommendationFilterDto {
  page: number;
  limit: number;
  isDismissed?: boolean;
}

export type RecommendationPaginatedResult = PaginatedResult<RecommendationDto>;