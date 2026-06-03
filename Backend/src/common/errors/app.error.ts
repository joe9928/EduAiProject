/**
 * Base application error class
 * All custom errors extend this so our error handler
 * can distinguish application errors from unexpected crashes
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Auth errors
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code = "AUTH_UNAUTHORIZED") {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code = "AUTH_INSUFFICIENT_ROLE") {
    super(message, 403, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string) {
    super(message, 409, code);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code: string) {
    super(message, 404, code);
  }
}