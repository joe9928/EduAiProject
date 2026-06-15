import { useQuery } from '@tanstack/react-query';
import {
  MOCK_LECTURER_ANALYTICS,
  MOCK_PENDING_SUBMISSIONS,
} from '@/mocks/lecturer';
import type { LecturerAnalytics, SubmissionSummary } from '@/features/dashboard/lecturer/types';

// ─── Query Key Factory ────────────────────────────────────────────────────────
// Extend this as lecturer features grow. Centralised here until the project
// migrates to a shared queryKeys.ts factory.
export const lecturerQueryKeys = {
  dashboard: ['lecturer', 'dashboard'] as const,
  analytics: ['lecturer', 'analytics'] as const,
  pendingSubmissions: ['lecturer', 'submissions', 'pending'] as const,
  atRisk: ['lecturer', 'at-risk'] as const,
};

// ─── Mock fetch helpers ───────────────────────────────────────────────────────
// Swap these for real fetch() calls against the backend when ready.
// Nothing above this layer changes — hooks are the only swap point.

const fetchLecturerAnalytics = (): Promise<LecturerAnalytics> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_LECTURER_ANALYTICS), 600)
  );

const fetchPendingSubmissions = (): Promise<SubmissionSummary[]> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_PENDING_SUBMISSIONS), 800)
  );

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useLecturerAnalytics() {
  return useQuery({
    queryKey: lecturerQueryKeys.analytics,
    queryFn: fetchLecturerAnalytics,
    staleTime: 1000 * 60 * 5, // 5 min — analytics don't need to be live
  });
}

export function usePendingSubmissions() {
  return useQuery({
    queryKey: lecturerQueryKeys.pendingSubmissions,
    queryFn: fetchPendingSubmissions,
    staleTime: 1000 * 60 * 2, // 2 min — submissions are more time-sensitive
  });
}