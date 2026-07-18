// src/features/grading/hooks/useGradeBook.ts

import { useQuery } from '@tanstack/react-query'
import { fetchGradeBook } from '../services/gradebook.service'
import { gradeBookQueryKeys } from '../types/gradebook.types'

export function useGradeBook(courseId: string) {
  return useQuery({
    queryKey:  gradeBookQueryKeys.course(courseId),
    queryFn:   () => fetchGradeBook(courseId),
    enabled:   !!courseId,
    staleTime: 1000 * 60 * 5,
  })
}