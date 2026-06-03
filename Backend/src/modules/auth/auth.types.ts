import { Role, User , RefreshToken } from "@prisma/client";

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUserResponse;
}

export interface JwtPayload {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
}


// Consider adding these to auth.types.ts
export interface RefreshTokenDto {
  refreshToken: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}