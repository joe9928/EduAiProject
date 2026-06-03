import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils";
import { UnauthorizedError, ForbiddenError } from "../errors/app.error";
import { prisma } from "../../database/prisma.client";
import { Role } from "@prisma/client";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new UnauthorizedError("No token provided", "AUTH_TOKEN_MISSING")
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return next(
        new UnauthorizedError("User not found or inactive", "AUTH_USER_INACTIVE")
      );
    }

    // Cast req to any to attach user — avoids declaration merging complexity
    (req as any).user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    const err = error as Error;

    if (err.name === "TokenExpiredError") {
      return next(
        new UnauthorizedError("Token has expired", "AUTH_TOKEN_EXPIRED")
      );
    }

    if (err.name === "JsonWebTokenError") {
      return next(
        new UnauthorizedError("Invalid token", "AUTH_TOKEN_INVALID")
      );
    }

    next(error);
  }
}

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      return next(
        new UnauthorizedError("Not authenticated", "AUTH_UNAUTHORIZED")
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return next(
        new ForbiddenError("You do not have permission to access this resource")
      );
    }

    next();
  };
}