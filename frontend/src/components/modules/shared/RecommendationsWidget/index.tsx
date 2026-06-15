// src/components/modules/shared/RecommendationsWidget/index.tsx
'use client'

import {
  Sparkles,
  ArrowRight,
  X,
  BookOpen,
  PlayCircle,
  FileQuestion,
} from 'lucide-react'
import Link from 'next/link'
import {
  useRecommendations,
  useDismissRecommendation,
} from '@/hooks/useStudent'
import type { Recommendation } from '@/lib/api/student'

const resourceConfig = {
  COURSE: {
    icon: BookOpen,
    href: (id: string) => `/dashboard/courses/${id}`,
    color: 'oklch(var(--spark))',
  },
  LESSON: {
    icon: PlayCircle,
    href: (id: string) => `/dashboard/lessons/${id}`,
    color: 'oklch(var(--ocean-300))',
  },
  QUIZ: {
    icon: FileQuestion,
    href: (id: string) => `/dashboard/quizzes/${id}`,
    color: 'oklch(0.75 0.15 150)',
  },
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const dismiss = useDismissRecommendation()
  const config = resourceConfig[rec.resourceType]
  const Icon = config.icon

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--background))] p-3.5 transition-all hover:border-[oklch(var(--spark)/0.3)]">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: `${config.color}/0.12`,
          border: `1px solid ${config.color}/0.25`,
        }}
      >
        <Icon className="h-4 w-4" style={{ color: config.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[oklch(var(--foreground))]">
          {rec.title}
        </p>
        <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">
          {rec.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Link
          href={config.href(rec.resourceId)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[oklch(var(--muted-foreground))] transition-colors hover:bg-[oklch(var(--foreground)/0.05)] hover:text-[oklch(var(--foreground))]"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={() => dismiss.mutate(rec.id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[oklch(var(--muted-foreground))] transition-colors hover:bg-[oklch(var(--foreground)/0.05)] hover:text-red-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function RecommendationsWidget() {
  const { data: recommendations = [], isLoading } = useRecommendations()
  console.log(
    'Recommendations:',
    recommendations,
    typeof recommendations,
    Array.isArray(recommendations)
  )
  return (
    <div
      className="rounded-xl border border-[oklch(var(--spark)/0.2)] p-5"
      style={{
        background:
          'linear-gradient(160deg, oklch(var(--ocean-900)) 0%, oklch(var(--card)) 100%)',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[oklch(var(--spark))]" />
          <h2 className="font-display text-base font-semibold text-[oklch(var(--foreground))]">
            EduAI Recommends
          </h2>
        </div>
        {recommendations.length > 0 && (
          <span className="rounded-full bg-[oklch(var(--spark)/0.15)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(var(--spark))]">
            {recommendations.length} new
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-[oklch(var(--border)/0.3)]"
            />
          ))
        ) : recommendations.length === 0 ? (
          <div className="py-6 text-center text-sm text-[oklch(var(--muted-foreground))]">
            Complete more lessons to unlock AI recommendations
          </div>
        ) : (
          recommendations
            .slice(0, 3)
            .map((rec) => <RecommendationCard key={rec.id} rec={rec} />)
        )}
      </div>

      <Link
        href="/dashboard/eduai"
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[oklch(var(--spark)/0.25)] py-2.5 text-sm font-medium text-[oklch(var(--spark))] transition-all hover:bg-[oklch(var(--spark)/0.08)]"
      >
        Open EduAI Assistant
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
