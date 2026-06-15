// src/app/(dashboard)/dashboard/page.tsx
'use client'

import { useAuthStore }          from '@/store/auth.store'
import StudentDashboardHome      from '@/components/modules/student/StudentDashboardHome'
// These will be added as we build them:
import LecturerDashboardHome  from '@/features/dashboard/lecturer/index'
// import AdminDashboardHome     from '@/components/modules/admin/AdminDashboardHome'

export default function DashboardPage() {
  const { user } = useAuthStore()
  if (!user) return null

  if (user.role === 'STUDENT')       return <StudentDashboardHome />
  if (user.role === 'LECTURER')   return <LecturerDashboardHome />
  // if (user.role === 'ADMINISTRATOR') return <AdminDashboardHome />

  return <StudentDashboardHome /> // fallback
}