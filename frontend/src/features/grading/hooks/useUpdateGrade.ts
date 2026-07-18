// src/features/grading/hooks/useUpdateGrade.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGrade } from '../services/gradebook.service'
import { gradeBookQueryKeys } from '../types/gradebook.types'
import type { UpdateGradePayload, GradeBook } from '../types/gradebook.types'
import { toast } from 'sonner'

export function useUpdateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateGradePayload) => updateGrade(payload),

    onMutate: async (payload) => {
      const queryKey = gradeBookQueryKeys.course(payload.courseId)
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<GradeBook>(queryKey)

      queryClient.setQueryData<GradeBook>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          entries: old.entries.map((entry) =>
            entry.studentId    === payload.studentId &&
            entry.assignmentId === payload.assignmentId
              ? { ...entry, grade: payload.grade, status: 'graded' as const }
              : entry
          ),
        }
      })

      return { previous, queryKey }
    },

    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      toast.error('Failed to save grade.')
    },

    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: gradeBookQueryKeys.course(payload.courseId),
      })
    },
  })
}