// src/hooks/useDashboard.ts
'use client'

import { useQuery }           from '@tanstack/react-query'
import { useAuthStore }       from '@/store/auth.store'
import { mockNotifications }  from '@/mocks/student'

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

export const queryKeys = {
  notifications: ['notifications'] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey:        queryKeys.notifications,
    queryFn:         async () => { await delay(); return mockNotifications },
    staleTime:       1 * 60 * 1000,
    refetchInterval: false,
  })
}

export function useGreeting() {
  const { user } = useAuthStore()
  const hour     = new Date().getHours()
  return {
    greeting:  hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening',
    firstName: user?.firstName ?? '',
    fullName:  user ? `${user.firstName} ${user.lastName}` : '',
    role:      user?.role ?? 'STUDENT',
  }
}