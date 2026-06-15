// src/store/auth.store.ts
import { create } from 'zustand'
import { IS_DEV_MODE, DEV_USER, DEV_TOKEN } from '@/mocks/devUser'

export interface User {
  id:               string
  email:            string
  firstName:        string
  lastName:         string
  role:             'STUDENT' | 'LECTURER' | 'ADMINISTRATOR'
  profileImageUrl?: string
}

interface AuthState {
  user:         User | null
  accessToken:  string | null
  isHydrated:   boolean

  setAuth:      (user: User, token: string) => void
  clearAuth:    () => void
  setHydrated:  () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  // ── DEV MODE: pre-populate so components never see null ──
  // Re-enable: change initial values back to null/false
  user:        IS_DEV_MODE ? DEV_USER  : null,
  accessToken: IS_DEV_MODE ? DEV_TOKEN : null,
  isHydrated:  IS_DEV_MODE ? true      : false,

  setAuth:     (user, accessToken) => set({ user, accessToken }),
  clearAuth:   ()                  => set({ user: null, accessToken: null }),
  setHydrated: ()                  => set({ isHydrated: true }),
}))