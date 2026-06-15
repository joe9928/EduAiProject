// src/hooks/useStudent.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  mockStudentAnalytics,
  mockRecommendations,
  mockCatalogue,
  mockCourseProgress,
  mockQuizAttempt,
  mockQuizResult,
  mockAvailableQuizzes,
} from '@/mocks/student'
import type { QuizAttempt, QuizResult } from '@/lib/api/student'

// Simulated network delay — makes loading states visible during dev
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

export const studentQueryKeys = {
  analytics:        ['student', 'analytics']        as const,
  recommendations:  ['student', 'recommendations']  as const,
  availableQuizzes: ['student', 'quizzes']          as const,
  quizAttempt:      (id: string) => ['quiz', 'attempt', id] as const,
  catalogue:        (page: number, search: string) =>
    ['courses', 'catalogue', page, search] as const,
}

export function useStudentAnalytics() {
  return useQuery({
    queryKey: studentQueryKeys.analytics,
    queryFn:  async () => { await delay(); return mockStudentAnalytics },
    staleTime: 2 * 60 * 1000,
  })
}

export function useRecommendations() {
  return useQuery({
    queryKey: studentQueryKeys.recommendations,
    queryFn:  async () => { await delay(); return mockRecommendations },
    staleTime: 5 * 60 * 1000,
  })
}

export function useAvailableQuizzes() {
  return useQuery({
    queryKey: studentQueryKeys.availableQuizzes,
    queryFn:  async () => { await delay(); return mockAvailableQuizzes },
    staleTime: 5 * 60 * 1000,
  })
}

export function useStartQuiz() {
  return useMutation<QuizAttempt, Error, string>({
    mutationFn: async (_quizId: string) => {
      await delay(800)
      // Returns a fresh attempt with current timestamp
      return { ...mockQuizAttempt, startedAt: new Date().toISOString() }
    },
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()

  return useMutation<
    QuizResult,
    Error,
    {
      quizId: string
      answers: {
        questionId: string
        selectedOption?: string
      }[]
    }
  >({
    mutationFn: async (_payload) => {
      await delay(1200) // simulate grading time
      return mockQuizResult
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.availableQuizzes,
      })
    },
  })
}
export function useCourseCatalogue(page = 1, search = '') {
  return useQuery({
    queryKey: studentQueryKeys.catalogue(page, search),
    queryFn:  async () => {
      await delay()
      const filtered = mockCatalogue.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
      return {
        data: filtered,
        meta: { total: filtered.length, page, limit: 12, totalPages: 1 },
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

export function useEnrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (courseId: string) => {
      await delay(800)
      return courseId
    },
    onSuccess: () => {
      toast.success('Successfully enrolled!')
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.analytics })
    },
  })
}

export function useDismissRecommendation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await delay(300); return id },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.recommendations,
      })
    },
  })
}

export function useGreeting() {
  // Keep this here — it's UI logic not mock data
  const hour = new Date().getHours()
  return {
    greeting:
      hour < 12 ? 'Good morning' :
      hour < 17 ? 'Good afternoon' :
                  'Good evening',
  }
}