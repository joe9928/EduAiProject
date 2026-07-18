// src/app/(dashboard)/dashboard/at-risk/page.tsx
// URL: /dashboard/at-risk

import { LecturerAtRiskView } from '@/features/at-risk'
import RoleGuard from '@/components/dashboard/RoleGuard'

export default function AtRiskPage() {
  return (
    <RoleGuard allowedRoles={['LECTURER']}>
      <LecturerAtRiskView />
    </RoleGuard>
  )
}