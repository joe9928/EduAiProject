// src/lib/api/auth.ts
import api from './client'
import { User } from '@/store/auth.store'

export interface AuthResponse {
  accessToken: string
  user:        User
}

export interface RegisterPayload {
  email:     string
  password:  string
  firstName: string
  lastName:  string
}

export interface LoginPayload {
  email:    string
  password: string
}

// ── REGISTER ─────────────────────────────────────
export async function registerUser(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', payload)
  return data.data
}

// ── LOGIN ─────────────────────────────────────────
export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', payload)
  return data.data
}

// ── GET CURRENT USER ──────────────────────────────
export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get('/auth/me')
  return data.data
}

// ── LOGOUT ────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout')
}

// ── SILENT REFRESH ────────────────────────────────
// Called once on app load — restores session from cookie
export async function refreshSession(): Promise<AuthResponse> {
  const { data } = await api.post('/auth/refresh')
  return data.data
}