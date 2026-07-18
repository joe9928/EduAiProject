// src/features/at-risk/hooks/useAtRiskStudents.ts

import { useQuery } from '@tanstack/react-query'
import { fetchAtRiskStudents } from '../services/at-risk.service'
import { atRiskQueryKeys } from '../types/at-risk.types'
import type { AtRiskFilters } from '../types/at-risk.types'

export function useAtRiskStudents(filters?: Partial<AtRiskFilters>) {
  return useQuery({
    queryKey: atRiskQueryKeys.list(filters),
    queryFn:  () => fetchAtRiskStudents(filters),
    staleTime: 1000 * 60 * 3,
  })
}