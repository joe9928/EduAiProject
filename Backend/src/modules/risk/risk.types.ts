import { RiskLevel } from "@prisma/client";
import { PaginatedResult } from "../../common/types/pagination.types";

export { RiskLevel };

export interface RiskFactors {
  performanceFactor: number;
  engagementFactor: number;
  completionFactor: number;
  activityFactor: number;
}

export interface RiskProfileDto {
  id: string;
  userId: string;
  courseId: string;
  riskScore: number;
  level: RiskLevel;
  factors: RiskFactors;
  calculatedAt: Date;
  alertSentAt: Date | null;
}

export interface RiskProfileWithStudent extends RiskProfileDto {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export type RiskPaginatedResult = PaginatedResult<RiskProfileWithStudent>;