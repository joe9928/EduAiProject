// src/app/(dashboard)/dashboard/quizzes/page.tsx
import QuizModule from '@/components/modules/student/QuizModule'
import RoleGuard  from '@/components/dashboard/RoleGuard'

export default function QuizzesPage() {
  return (
    <RoleGuard allowedRoles={['STUDENT']}>
      <QuizModule />
    </RoleGuard>
  )
}