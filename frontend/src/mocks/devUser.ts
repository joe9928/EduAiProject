// src/mocks/devUser.ts
import type { User } from '@/store/auth.store'

export const DEV_USER: User = {
  id:         'dev-student-001',
  email:      'jane.doe@edulearn.dev',
  firstName:  'Jane',
  lastName:   'Doe',
  role:       'LECTURER',   // ← change to 'LECTURER' or 'ADMINISTRATOR' or 'STUDENT' to test other roles
}

export const DEV_TOKEN = 'dev-mock-token-not-real'

export const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'