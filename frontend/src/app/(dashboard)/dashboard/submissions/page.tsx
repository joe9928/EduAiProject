// src/app/(dashboard)/dashboard/submissions/page.tsx
import RoleGuard from '@/components/dashboard/RoleGuard'
import SubmissionsModule from '@/components/modules/lecturer/SubmissionsModule'

export default function SubmissionsPage() {
  return (
    <RoleGuard allowedRoles={['LECTURER']} fallbackHref="/dashboard">
      <SubmissionsModule />
    </RoleGuard>
  )
}