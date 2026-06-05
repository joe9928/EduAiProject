import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import {ParsedQs} from "qs"

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        errors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}



// Add below the existing validate function
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid query parameters",
        errors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

        // Express v5 — req.query is read-only, store parsed data here instead
    (req as any).parsedQuery = result.data;
    next();
  };
}