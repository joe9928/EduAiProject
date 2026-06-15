// src/components/dashboard/AppSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { logoutUser } from '@/lib/api/auth'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  ClipboardList,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  GraduationCap,
  Sparkles,
  FileQuestion,
  ChevronRight,
  LogOut,
  UserCircle,
  ChevronsUpDown,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useNotifications } from '@/hooks/useDashboard'
import { useState } from 'react'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  exact?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

// We build nav groups dynamically so badge counts
// can come from real data
function useNavGroups() {
  const { data: notifications = [] } = useNotifications()
  console.log('notifications:', notifications)
  console.log('isArray:', Array.isArray(notifications))

  const safeNotifications = Array.isArray(notifications) ? notifications : []

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  const groups: NavGroup[] = [
    {
      label: 'Learn',
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          exact: true,
        },
        {
          label: 'My Courses',
          href: '/courses',
          icon: BookOpen,
        },
        {
          label: 'Lessons',
          href: '/lessons',
          icon: PlayCircle,
        },
        {
          label: 'Assignments',
          href: '/assignments',
          icon: ClipboardList,
        },
      ],
    },
    {
      label: 'Assess',
      items: [
        {
          label: 'Quizzes',
          href: '/quizzes',
          icon: FileQuestion,
        },
        {
          label: 'Assessments',
          href: '/assessments',
          icon: ClipboardList,
        },
      ],
    },
    {
      label: 'AI Tools',
      items: [
        {
          label: 'EduAI Assistant',
          href: '/eduai',
          icon: Sparkles,
          badge: 'NEW',
        },
      ],
    },
    {
      label: 'Community',
      items: [
        {
          label: 'Discussions',
          href: '/discussions',
          icon: MessageSquare,
          // Real unread count from API
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
      ],
    },
    {
      label: 'Account',
      items: [
        {
          label: 'My Analytics',
          href: 'analytics',
          icon: BarChart3,
        },
        
      ],
    },
  ]

  return groups
}

// ── User footer section ───────────────────────────
function SidebarUserFooter() {
  const { user, clearAuth } = useAuthStore()
  const { isMobile } = useSidebar()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '?'

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutUser()
    } catch {
      // Clear locally even if API fails
    } finally {
      clearAuth()
      toast.success('Signed out successfully.')
      window.location.href = '/'
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="relative">
          <SidebarMenuButton
            size="lg"
            onClick={() => setMenuOpen((p) => !p)}
            className="hover:bg-[oklch(var(--foreground)/0.05)]"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(var(--primary))] to-[oklch(var(--spark)/0.6)] text-xs font-bold text-[oklch(var(--foreground))]">
              {initials}
            </div>

            {/* Name + role */}
            <div className="flex flex-1 flex-col leading-none">
              <span className="text-sm font-semibold text-[oklch(var(--foreground))]">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-[oklch(var(--muted-foreground))] capitalize">
                {user?.role?.toLowerCase() ?? 'student'}
              </span>
            </div>

            <ChevronsUpDown className="ml-auto h-4 w-4 text-[oklch(var(--muted-foreground))]" />
          </SidebarMenuButton>

          {/* Popup menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                {/* User info */}
                <div className="border-b border-[oklch(var(--border))] px-3 py-3">
                  <p className="text-sm font-semibold text-[oklch(var(--foreground))]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[oklch(var(--muted-foreground))]">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="p-1">
                  {[
                    {
                      icon: UserCircle,
                      label: 'My Profile',
                      href: '/dashboard/profile',
                    },
                    {
                      icon: Settings,
                      label: 'Settings',
                      href: '/dashboard/settings',
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[oklch(var(--foreground)/0.8)] transition-colors hover:bg-[oklch(var(--foreground)/0.05)] hover:text-[oklch(var(--foreground))]"
                      >
                        <Icon className="h-4 w-4 text-[oklch(var(--muted-foreground))]" />
                        {item.label}
                      </Link>
                    )
                  })}

                  <div className="my-1 h-px bg-[oklch(var(--border))]" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// ── Main Sidebar ──────────────────────────────────
export function AppSidebar() {
  const pathname = usePathname()
  const navGroups = useNavGroups()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-[oklch(var(--spark)/0.08)]"
            >
              <Link href="/dashboard">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(var(--spark)/0.8)] to-[oklch(var(--ocean-500))] shadow-[0_0_12px_oklch(var(--spark)/0.3)]">
                  <GraduationCap className="h-4 w-4 text-[oklch(var(--ocean-950))]" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-base font-bold text-[oklch(var(--foreground))]">
                    Edu<span className="text-[oklch(var(--spark))]">Learn</span>
                  </span>
                  <span className="text-[10px] text-[oklch(var(--muted-foreground))]">
                    AI Learning Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav groups */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-widest text-[oklch(var(--muted-foreground)/0.6)] uppercase">
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href, item.exact)

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={
                          active
                            ? 'bg-[oklch(var(--spark)/0.12)] text-[oklch(var(--spark))] hover:bg-[oklch(var(--spark)/0.16)]'
                            : 'text-[oklch(var(--foreground)/0.7)] hover:bg-[oklch(var(--foreground)/0.05)] hover:text-[oklch(var(--foreground))]'
                        }
                      >
                        <Link href={item.href}>
                          <Icon
                            className={`h-4 w-4 ${
                              active
                                ? 'text-[oklch(var(--spark))]'
                                : 'text-[oklch(var(--muted-foreground))]'
                            }`}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>

                      {item.badge !== undefined && (
                        <SidebarMenuBadge
                          className={
                            item.badge === 'NEW'
                              ? 'bg-[oklch(var(--spark)/0.15)] text-[9px] font-semibold text-[oklch(var(--spark))]'
                              : 'bg-[oklch(var(--primary)/0.3)] text-[10px] text-[oklch(var(--foreground)/0.8)]'
                          }
                        >
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with real user */}
      <SidebarFooter>
        <SidebarUserFooter />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
