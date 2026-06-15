// src/components/dashboard/DashboardHeader.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator }      from '@/components/ui/separator'
import { Bell, Search, X, CheckCheck } from 'lucide-react'
import { useNotifications } from '@/hooks/useDashboard'
import { markNotificationRead } from '@/lib/api/user'
import { useQueryClient }       from '@tanstack/react-query'
import { queryKeys }            from '@/hooks/useDashboard'
import { formatDistanceToNow }  from 'date-fns'

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':             'Overview',
  '/dashboard/courses':     'My Courses',
  '/dashboard/lessons':     'Lessons',
  '/dashboard/assignments': 'Assignments',
  '/dashboard/quizzes':     'Quizzes',
  '/dashboard/assessments': 'Assessments',
  '/dashboard/eduai':       'EduAI Assistant',
  '/dashboard/discussions': 'Discussions',
  '/dashboard/analytics':   'My Analytics',
  '/dashboard/settings':    'Settings',
  '/dashboard/profile':     'My Profile',
}

export default function DashboardHeader() {
  const pathname     = usePathname()
  const pageLabel    = ROUTE_LABELS[pathname] ?? 'Dashboard'
  const queryClient  = useQueryClient()

  const [notifOpen, setNotifOpen] = useState(false)

  const { data: notifications = [], isLoading } = useNotifications()
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id)
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.notifications,
        notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      )
    } catch {
      // silently fail
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) => markNotificationRead(n.id))
      )
      queryClient.setQueryData(
        queryKeys.notifications,
        notifications.map((n) => ({ ...n, read: true }))
      )
    } catch {
      // silently fail
    }
  }

  const notifTypeColor: Record<string, string> = {
    assignment: 'oklch(var(--spark))',
    discussion: 'oklch(var(--ocean-300))',
    grade:      'oklch(0.75 0.15 150)',
    system:     'oklch(var(--muted-foreground))',
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[oklch(var(--border))] bg-[oklch(var(--background))] px-4">
      <SidebarTrigger className="-ml-1 text-[oklch(var(--muted-foreground))] hover:text-[oklch(var(--foreground))]" />

      <Separator orientation="vertical" className="h-4" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-[oklch(var(--muted-foreground))]">
          EduLearn
        </span>
        <span className="text-[oklch(var(--muted-foreground)/0.5)]">/</span>
        <span className="font-medium text-[oklch(var(--foreground))]">
          {pageLabel}
        </span>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[oklch(var(--muted-foreground))] transition-colors hover:bg-[oklch(var(--foreground)/0.05)] hover:text-[oklch(var(--foreground))]">
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[oklch(var(--muted-foreground))] transition-colors hover:bg-[oklch(var(--foreground)/0.05)] hover:text-[oklch(var(--foreground))]"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(var(--spark))] text-[9px] font-bold text-[oklch(var(--ocean-950))]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[oklch(var(--border))] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[oklch(var(--foreground))]">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[oklch(var(--spark)/0.15)] px-1.5 py-0.5 text-[10px] font-semibold text-[oklch(var(--spark))]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[oklch(var(--muted-foreground))] transition-colors hover:text-[oklch(var(--foreground))]"
                      >
                        <CheckCheck className="h-3 w-3" />
                        All read
                      </button>
                    )}
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="rounded-lg p-1 text-[oklch(var(--muted-foreground))] transition-colors hover:text-[oklch(var(--foreground))]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notification list */}
                <div className="max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[oklch(var(--spark))] border-t-transparent" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[oklch(var(--muted-foreground))]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => !notif.read && handleMarkRead(notif.id)}
                        className={`flex cursor-pointer gap-3 border-b border-[oklch(var(--border)/0.5)] px-4 py-3 transition-colors last:border-0 hover:bg-[oklch(var(--foreground)/0.03)] ${
                          !notif.read ? 'bg-[oklch(var(--spark)/0.03)]' : ''
                        }`}
                      >
                        {/* Type indicator */}
                        <div
                          className="mt-1 h-2 w-2 shrink-0 rounded-full"
                          style={{
                            background: notifTypeColor[notif.type] ?? 'oklch(var(--muted-foreground))',
                            opacity: notif.read ? 0.3 : 1,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm ${
                            notif.read
                              ? 'text-[oklch(var(--foreground)/0.6)]'
                              : 'font-medium text-[oklch(var(--foreground))]'
                          }`}>
                            {notif.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">
                            {notif.message}
                          </p>
                          <p className="mt-1 text-[10px] text-[oklch(var(--muted-foreground)/0.6)]">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}