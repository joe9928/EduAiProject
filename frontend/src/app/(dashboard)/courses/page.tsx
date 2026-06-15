// src/app/(dashboard)/dashboard/courses/page.tsx
import EnrolledCoursesModule from '@/components/modules/student/EnrolledCourseModule'
import RoleGuard             from '@/components/dashboard/RoleGuard'

export default function CoursesPage() {
  return (
    <RoleGuard allowedRoles={['STUDENT']}>
      <EnrolledCoursesModule />
    </RoleGuard>
  )
}