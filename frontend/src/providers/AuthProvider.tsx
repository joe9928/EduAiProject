// src/providers/AuthProvider.tsx
'use client'

import { useEffect, useCallback, useRef } from 'react'
import { usePathname }   from 'next/navigation'
import { useAuthStore }  from '@/store/auth.store'
import { refreshSession } from '@/lib/api/auth'
import { IS_DEV_MODE }   from '@/mocks/devUser'

const REFRESH_INTERVAL_MS = 13 * 60 * 1000
const PROTECTED_PREFIXES  = ['/dashboard']

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hasRun   = useRef(false)

  const { setAuth, setHydrated, clearAuth, accessToken } = useAuthStore()

  const refresh = useCallback(async () => {
    try {
      const { accessToken: newToken, user } = await refreshSession()
      setAuth(user, newToken)
      return true
    } catch {
      return false
    }
  }, [setAuth])

  useEffect(() => {
    // ── DEV MODE: skip session restore entirely ──────────
    // Store is already pre-populated with DEV_USER in auth.store.ts
    // Re-enable: remove this early return
    if (IS_DEV_MODE) return

    if (hasRun.current) return
    hasRun.current = true

    const restore = async () => {
      const currentToken = useAuthStore.getState().accessToken
      if (currentToken) { setHydrated(); return }

      const success = await refresh()

      if (!success) {
        const isProtected = PROTECTED_PREFIXES.some((p) =>
          pathname.startsWith(p)
        )
        if (isProtected) {
          window.location.href = `/login?from=${encodeURIComponent(pathname)}`
          return
        }
      }

      setHydrated()
    }

    restore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── DEV MODE: skip proactive refresh ─────────────────
  useEffect(() => {
    if (IS_DEV_MODE) return
    if (!accessToken) return

    const interval = setInterval(async () => {
      const success = await refresh()
      if (!success) {
        clearAuth()
        window.location.href = '/login'
      }
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [accessToken, refresh, clearAuth])

  // ── DEV MODE: skip visibility refresh ────────────────
  useEffect(() => {
    if (IS_DEV_MODE) return
    if (!accessToken) return

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [accessToken, refresh])

  return <>{children}</>
}