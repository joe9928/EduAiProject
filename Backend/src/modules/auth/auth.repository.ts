import { prisma } from "../../database/prisma.client";
import { Role, User, RefreshToken } from "@prisma/client";

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: Role;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        role: data.role,
      },
    });
  }

  async createRefreshToken(data: {
    tokenHash: string;
    familyId: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        ...data,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
  }

  async revokeTokenFamily(familyId: string): Promise<number> {
    const result = await prisma.refreshToken.updateMany({
      where: { familyId },
      data: { revokedAt: new Date() },
    });
    return result.count;
  }

  async markTokenAsUsed(tokenId: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  }
}
