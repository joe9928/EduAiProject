// src/components/dashboard/RoleGuard.tsx
'use client'

import { useEffect }     from 'react'
import { useAuthStore }  from '@/store/auth.store'
import { IS_DEV_MODE }   from '@/mocks/devUser'
import type { UserRole } from '@/config/dashboard/roles'

interface RoleGuardProps {
  allowedRoles:  UserRole[]
  children:      React.ReactNode
  fallbackHref?: string
}

export default function RoleGuard({
  allowedRoles,
  children,
  fallbackHref = '/dashboard',
}: RoleGuardProps) {
  const { user, isHydrated } = useAuthStore()

  useEffect(() => {
    // ── DEV MODE: skip role enforcement ─────────────────
    // Re-enable: remove this early return
    if (IS_DEV_MODE) return

    if (!isHydrated) return
    if (!user) { window.location.href = '/login'; return }
    if (!allowedRoles.includes(user.role as UserRole)) {
      window.location.href = fallbackHref
    }
  }, [user, isHydrated, allowedRoles, fallbackHref])

  // ── DEV MODE: always render children ────────────────
  if (IS_DEV_MODE) return <>{children}</>

  if (!isHydrated || !user) return null
  if (!allowedRoles.includes(user.role as UserRole)) return null

  return <>{children}</>
}