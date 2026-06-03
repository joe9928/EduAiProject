import { Role } from "@prisma/client";
import { Request } from "express";

/**
 * Extended Express Request with authenticated user attached
 * Used in all protected route handlers
 */
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}