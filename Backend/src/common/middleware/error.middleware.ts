import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";

export function globalErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Known application error — we threw this intentionally
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unknown error — log it, return generic message
  // Never expose internal error details in production
  console.error("Unhandled error:", error);

  res.status(500).json({
    success: false,
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : (error as Error).message,
    timestamp: new Date().toISOString(),
  });
}