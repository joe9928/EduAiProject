import { Prisma, Recommendation } from "@prisma/client";

import { prisma } from "../../database/prisma.client";

import {
  CreateRecommendationInput,
  RecommendationFilterInput,
} from "./recommendation.validation";

import {
  RecommendationDto,
  RecommendationPaginatedResult,
} from "./recommendation.types";

export class RecommendationRepository {
  async findByUser(
    userId: string,
    filters: RecommendationFilterInput,
  ): Promise<RecommendationPaginatedResult> {
    const { page, limit, isDismissed } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.RecommendationWhereInput = {
      userId,
    };

    if (isDismissed !== undefined) {
      where.isDismissed = isDismissed;
    }

    const [recommendations, total] = await Promise.all([
      prisma.recommendation.findMany({
        where,

        skip,
        take: limit,

        // Highest confidence recommendations first
        orderBy: [{ score: "desc" }, { generatedAt: "desc" }],
      }),

      prisma.recommendation.count({
        where,
      }),
    ]);

    const data: RecommendationDto[] = recommendations.map((r) => ({
      id: r.id,
      type: r.type,
      resourceType: r.resourceType,
      resourceId: r.resourceId,
      reason: r.reason,
      score: r.score,
      isDismissed: r.isDismissed,
      isActedOn: r.isActedOn,
      generatedAt: r.generatedAt,
      expiresAt: r.expiresAt,
    }));

    return {
      data,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Recommendation | null> {
    return prisma.recommendation.findUnique({
      where: { id },
    });
  }

  async dismiss(id: string): Promise<Recommendation> {
    return prisma.recommendation.update({
      where: { id },

      data: {
        isDismissed: true,
      },
    });
  }

  async markActedOn(id: string): Promise<Recommendation> {
    return prisma.recommendation.update({
      where: { id },

      data: {
        isActedOn: true,
      },
    });
  }

  async createRecommendation(
    userId: string,
    data: CreateRecommendationInput,
  ): Promise<Recommendation> {
    return prisma.recommendation.create({
      data: {
        userId,

        type: data.type,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        reason: data.reason,
        score: data.score,
        expiresAt: data.expiresAt,
      },
    });
  }

  async deleteExpired(userId: string): Promise<number> {
    const result = await prisma.recommendation.deleteMany({
      where: {
        userId,

        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  async findExisting(
    userId: string,
    resourceId: string,
  ): Promise<Recommendation | null> {
    return prisma.recommendation.findFirst({
      where: { userId, resourceId, isDismissed: false },
    });
  }
}
