// src/features/courses/hooks/useCourses.ts

import { useQuery } from '@tanstack/react-query'
import { fetchLecturerCourses } from '../services/course.service'
import { courseQueryKeys } from '../types/course.types'
import type { CourseFilters } from '../types/course.types'

export function useCourses(filters?: Partial<CourseFilters>) {
  return useQuery({
    queryKey: courseQueryKeys.list(filters),
    queryFn:  () => fetchLecturerCourses(filters),
    staleTime: 1000 * 60 * 5,
  })
}