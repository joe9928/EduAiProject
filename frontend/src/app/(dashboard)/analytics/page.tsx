// src/app/(dashboard)/dashboard/analytics/page.tsx
import StudentAnalyticsModule from '@/components/modules/student/StudentAnalytics'
import RoleGuard              from '@/components/dashboard/RoleGuard'

export default function AnalyticsPage() {
  return (
    <RoleGuard allowedRoles={['STUDENT']}>
      <StudentAnalyticsModule />
    </RoleGuard>
  )
}