import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Role } from "@prisma/client";
import { AuthRepository } from "./auth.repository";
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  AuthUserResponse,
} from "./auth.types";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from "../../common/utils/token.utils";
import {
  UnauthorizedError,
  ConflictError,
} from "../../common/errors/app.error";

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(
    dto: RegisterDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ auth: AuthResponse; refreshToken: string }> {
    // 1. Check email uniqueness
    const existingUser = await this.repository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError("Email already registered", "AUTH_EMAIL_TAKEN");
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 3. Create user
    const user = await this.repository.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.STUDENT,
    });

    // 4 & 5. Generate tokens
    const { accessToken, refreshToken } = await this.generateAndStoreTokens(
      user,
      ipAddress,
      userAgent,
    );

    return {
      auth: { accessToken, user: this.formatUser(user) },
      refreshToken,
    };
  }

  async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ auth: AuthResponse; refreshToken: string }> {
    // 1. Find user — same error message whether email missing or password wrong
    const user = await this.repository.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials", "AUTH_INVALID_CREDENTIALS");
    }

    // 2. Fail fast — check isActive before expensive bcrypt call
    if (!user.isActive) {
      throw new UnauthorizedError("Account is inactive", "AUTH_ACCOUNT_INACTIVE");
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials", "AUTH_INVALID_CREDENTIALS");
    }

    // 4. Generate tokens
    const { accessToken, refreshToken } = await this.generateAndStoreTokens(
      user,
      ipAddress,
      userAgent,
    );

    return {
      auth: { accessToken, user: this.formatUser(user) },
      refreshToken,
    };
  }

  async refreshTokens(
    rawRefreshToken: string,
    ipAddress?: string,
  ): Promise<{ auth: AuthResponse; refreshToken: string }> {
    // 1. Hash incoming token and find DB record
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawRefreshToken)
      .digest("hex");

    const tokenRecord = await this.repository.findRefreshToken(tokenHash);

    // 2. Check exists, not revoked, not expired
    if (
      !tokenRecord ||
      tokenRecord.revokedAt !== null ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedError(
        "Invalid or expired refresh token",
        "AUTH_INVALID_REFRESH_TOKEN",
      );
    }

    // 3. THEFT DETECTION — token already used means someone else used it
    if (tokenRecord.usedAt !== null) {
      await this.repository.revokeTokenFamily(tokenRecord.familyId);
      throw new UnauthorizedError(
        "Refresh token reuse detected",
        "AUTH_REFRESH_TOKEN_REUSE",
      );
    }

    // 4. Mark this token as used (it's now consumed)
    await this.repository.markTokenAsUsed(tokenRecord.id);

    // 5. Fetch user and issue new token pair (same familyId = same session)
    const user = await this.repository.findUserById(tokenRecord.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive", "AUTH_UNAUTHORIZED");
    }

    const { accessToken, refreshToken } = await this.generateAndStoreTokens(
      user,
      ipAddress,
      undefined,
      tokenRecord.familyId,
    );

    return {
      auth: { accessToken, user: this.formatUser(user) },
      refreshToken,
    };
  }

  async logout(rawRefreshToken: string): Promise<void> {
    // 1. Hash the token
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawRefreshToken)
      .digest("hex");

    // 2. Find the record
    const tokenRecord = await this.repository.findRefreshToken(tokenHash);

    // 3. If not found, treat as already logged out — no error needed
    if (!tokenRecord) return;

    // 4. Revoke entire family (all devices/tabs sharing this session)
    await this.repository.revokeTokenFamily(tokenRecord.familyId);
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private formatUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  }): AuthUserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  private async generateAndStoreTokens(
    user: { id: string; role: Role },
    ipAddress?: string,
    userAgent?: string,
    existingFamilyId?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = generateAccessToken(user.id, user.role);
    const { raw, hash } = generateRefreshToken();
    const familyId = existingFamilyId ?? uuidv4();

    await this.repository.createRefreshToken({
      tokenHash: hash,
      familyId,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
      ipAddress,
      userAgent,
    });

    return { accessToken, refreshToken: raw };
  }
}