// src/app/(dashboard)/dashboard/grades/page.tsx
// URL: /dashboard/grades

import { LecturerGradeBookView } from '@/features/grading'
import RoleGuard from '@/components/dashboard/RoleGuard'

export default function GradesPage() {
  return (
    <RoleGuard allowedRoles={['LECTURER']}>
      <LecturerGradeBookView />
    </RoleGuard>
  )
}