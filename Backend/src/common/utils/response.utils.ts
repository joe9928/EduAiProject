import { Response } from "express";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Send a successful response with consistent envelope shape
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta
): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Set an HTTP-only cookie for the refresh token
 * HTTP-only = JavaScript cannot read it (XSS protection)
 * Secure = only sent over HTTPS (in production)
 * SameSite Strict = not sent on cross-site requests (CSRF protection)
 */
export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/auth", // cookie only sent to /auth routes
  });
}

/**
 * Clear the refresh token cookie on logout
 */
export function clearRefreshTokenCookie(res: Response): void {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/auth",
  });
}