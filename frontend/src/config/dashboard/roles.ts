// src/config/dashboard/roles.ts

import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  ClipboardList,
  Sparkles,
  MessageSquare,
  BarChart3,
  Settings,
  FileQuestion,
  Users,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Bell,
  PieChart,
} from 'lucide-react'

export type UserRole = 'STUDENT' | 'LECTURER' | 'ADMINISTRATOR'

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: 'notifications' | 'assignments' | 'submissions' | string
  exact?: boolean
  roles: UserRole[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// Single source of truth for ALL navigation
// Shell reads this and filters by role — no conditionals in components
// src/config/dashboard/roles.ts — fix all hrefs

export const NAV_CONFIG: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard', // ✅ already correct
        icon: LayoutDashboard,
        exact: true,
        roles: ['STUDENT', 'LECTURER', 'ADMINISTRATOR'],
      },
    ],
  },
  {
    label: 'Learning',
    items: [
      {
        label: 'My Courses',
        href: '/dashboard/courses', // ← was '/courses'
        icon: BookOpen,
        badge: 'assignments',
        roles: ['STUDENT'],
      },
      {
        label: 'Continue Learning',
        href: '/dashboard/lessons', // ← was '/lessons'
        icon: PlayCircle,
        roles: ['STUDENT'],
      },
      {
        label: 'My Assignments',
        href: '/dashboard/assignments', // ← was '/assignments'
        icon: ClipboardList,
        badge: 'assignments',
        roles: ['STUDENT'],
      },
      {
        label: 'Quizzes',
        href: '/dashboard/quizzes', // ← was '/quizzes'
        icon: FileQuestion,
        roles: ['STUDENT'],
      },
    ],
  },
  {
    label: 'Teaching',
    items: [
      {
        label: 'My Courses',
        href: '/dashboard/courses', // ← fix
        icon: GraduationCap,
        roles: ['LECTURER'],
      },
      {
        label: 'Course Builder',
        href: '/dashboard/builder', // ← fix
        icon: BookOpen,
        roles: ['LECTURER'],
      },
      {
        label: 'Submissions',
        href: '/dashboard/submissions', // ← fix
        icon: ClipboardList,
        badge: 'submissions',
        roles: ['LECTURER'],
      },
      {
        label: 'Grade Book',
        href: '/dashboard/grades', // ← fix
        icon: TrendingUp,
        roles: ['LECTURER'],
      },
      {
        label: 'At-Risk Students',
        href: '/dashboard/at-risk', // ← fix
        icon: Bell,
        roles: ['LECTURER'],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        label: 'Users',
        href: '/dashboard/admin/users', // ← fix
        icon: Users,
        roles: ['ADMINISTRATOR'],
      },
      {
        label: 'All Courses',
        href: '/dashboard/admin/courses', // ← fix
        icon: BookOpen,
        roles: ['ADMINISTRATOR'],
      },
      {
        label: 'System Analytics',
        href: '/dashboard/admin/analytics', // ← fix
        icon: PieChart,
        roles: ['ADMINISTRATOR'],
      },
      {
        label: 'Roles & Access',
        href: '/dashboard/admin/roles', // ← fix
        icon: ShieldCheck,
        roles: ['ADMINISTRATOR'],
      },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      {
        label: 'EduAI Assistant',
        href: '/dashboard/eduai', // ← fix
        icon: Sparkles,
        badge: 'NEW',
        roles: ['STUDENT', 'LECTURER'],
      },
    ],
  },
  {
    label: 'Community',
    items: [
      {
        label: 'Discussions',
        href: '/dashboard/discussions', // ← fix
        icon: MessageSquare,
        badge: 'notifications',
        roles: ['STUDENT', 'LECTURER'],
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Analytics',
        href: '/dashboard/analytics', // ← fix
        icon: BarChart3,
        roles: ['STUDENT', 'LECTURER'],
      },
      {
        label: 'Settings',
        href: '/dashboard/settings', // ← fix
        icon: Settings,
        roles: ['STUDENT', 'LECTURER', 'ADMINISTRATOR'],
      },
    ],
  },
]

// Helper — filter nav for a specific role
export function getNavForRole(role: UserRole): NavGroup[] {
  return NAV_CONFIG.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.items.length > 0)
}
