import { Role } from "@prisma/client";

// This file extends Express's built-in types
// The 'd.ts' extension means "declaration file" — types only, no runtime code
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}