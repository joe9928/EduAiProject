import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils";
import { UnauthorizedError, ForbiddenError } from "../errors/app.error";
import { prisma } from "../../database/prisma.client";
import { Role } from "@prisma/client";

/**
 * Protects routes by validating the JWT access token.
 * On success: attaches user to req.user and calls next()
 * On failure: passes error to global error handler
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new UnauthorizedError(
          "No token provided",
          "AUTH_TOKEN_MISSING"
        )
      );
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify signature and expiry
    // verifyAccessToken throws if invalid or expired
    const payload = verifyAccessToken(token);

    // 3. Fetch fresh user from DB
    // We don't trust the token alone — user might be deactivated since token was issued
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return next(
        new UnauthorizedError(
          "User not found or inactive",
          "AUTH_USER_INACTIVE"
        )
      );
    }

    // 4. Attach to request — available in all downstream handlers
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    // jwt.verify throws JsonWebTokenError or TokenExpiredError
    const err = error as Error;

    if (err.name === "TokenExpiredError") {
      return next(
        new UnauthorizedError(
          "Token has expired",
          "AUTH_TOKEN_EXPIRED"
        )
      );
    }

    if (err.name === "JsonWebTokenError") {
      return next(
        new UnauthorizedError(
          "Invalid token",
          "AUTH_TOKEN_INVALID"
        )
      );
    }

    next(error);
  }
}

/**
 * Role-based authorization middleware factory.
 * Use after authenticate() — requires req.user to exist.
 *
 * Usage: router.get("/admin", authenticate, authorize(Role.ADMINISTRATOR), handler)
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        new UnauthorizedError("Not authenticated", "AUTH_UNAUTHORIZED")
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          "You do not have permission to access this resource"
        )
      );
    }

    next();
  };
}