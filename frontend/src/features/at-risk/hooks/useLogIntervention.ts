// src/features/at-risk/hooks/useLogIntervention.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logIntervention } from '../services/at-risk.service'
import { atRiskQueryKeys } from '../types/at-risk.types'
import type { LogInterventionPayload, AtRiskStudent } from '../types/at-risk.types'
import { toast } from 'sonner'

export function useLogIntervention(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LogInterventionPayload) => logIntervention(payload),

    // Optimistic update — new intervention appears in timeline immediately
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: atRiskQueryKeys.all })

      const previousData = queryClient.getQueriesData<AtRiskStudent[]>({
        queryKey: atRiskQueryKeys.all,
      })

      const optimisticIntervention = {
        id:        `int_optimistic_${Date.now()}`,
        type:      payload.type,
        note:      payload.note,
        createdAt: new Date().toISOString(),
        createdBy: 'Dr. Smith',
      }

      queryClient.setQueriesData<AtRiskStudent[]>(
        { queryKey: atRiskQueryKeys.all },
        (old) => {
          if (!old) return old
          return old.map((student) =>
            student.id === payload.studentId
              ? {
                  ...student,
                  interventions: [optimisticIntervention, ...student.interventions],
                }
              : student
          )
        }
      )

      return { previousData }
    },

    onError: (_err, _payload, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error('Failed to log intervention. Please try again.')
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atRiskQueryKeys.all })
      toast.success('Intervention logged successfully.')
      options?.onSuccess?.()
    },
  })
}