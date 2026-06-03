import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import {
  sendSuccess,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../../common/utils/response.utils";
import { UnauthorizedError } from "../../common/errors/app.error";

const authService = new AuthService();

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];

  try {
    const { auth, refreshToken } = await authService.register(
      req.body,
      ipAddress,
      userAgent,
    );
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, auth, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];

  try {
    const { auth, refreshToken } = await authService.login(
      req.body,
      ipAddress,
      userAgent,
    );
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, auth);
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.refreshToken;
  const ipAddress = req.ip;

  if (!token) {
    return next(
      new UnauthorizedError(
        "Refresh token missing",
        "AUTH_REFRESH_TOKEN_MISSING",
      ),
    );
  }

  try {
    const { auth, refreshToken } = await authService.refreshTokens(
      token,
      ipAddress,
    );
    setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, auth);
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.refreshToken;

  try {
    if (token) {
      await authService.logout(token);
    }
  } catch (error) {
    // Log but don't fail — client should always be logged out
    console.error("Error revoking token during logout:", error);
  } finally {
    clearRefreshTokenCookie(res);
    sendSuccess(res, { message: "Logged out successfully" });
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  res.status(501).json({ message: "Not implemented yet" });
}
