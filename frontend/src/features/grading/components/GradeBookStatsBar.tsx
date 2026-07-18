// src/features/grading/components/GradeBookStatsBar.tsx

import { TrendingUp, TrendingDown, Award, Clock } from 'lucide-react'
import type { GradeBook } from '../types/gradebook.types'

interface Props { gradeBook: GradeBook; isLoading: boolean }

function computeStats(gb: GradeBook) {
  const graded   = gb.entries?.filter((e) => e.grade !== null) ?? []
  const grades   = graded.map((e) => e.grade as number)
  const ungraded = gb.entries?.filter((e) => e.grade === null && (e.status === 'pending' || e.status === 'late')).length ?? 0
  if (grades.length === 0) return { avg: null, highest: null, lowest: null, ungraded }
  const avg     = grades.reduce((s, g) => s + g, 0) / grades.length
  return { avg, highest: Math.max(...grades), lowest: Math.min(...grades), ungraded }
}

export function GradeBookStatsBar({ gradeBook, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-4">
            <div className="mb-2 h-9 w-9 animate-pulse rounded-lg bg-[oklch(var(--border))]" />
            <div className="h-7 w-14 animate-pulse rounded bg-[oklch(var(--border))]" />
            <div className="mt-1 h-3 w-20 animate-pulse rounded bg-[oklch(var(--border))]" />
          </div>
        ))}
      </div>
    )
  }

  const { avg, highest, lowest, ungraded } = computeStats(gradeBook)
  const stats = [
    { icon: TrendingUp,   label: 'Class Average',   value: avg     !== null ? `${avg.toFixed(1)}%`  : '—', accent: 'var(--spark)'     },
    { icon: Award,        label: 'Highest Grade',   value: highest !== null ? `${highest}%`         : '—', accent: 'var(--spark)'     },
    { icon: TrendingDown, label: 'Lowest Grade',    value: lowest  !== null ? `${lowest}%`          : '—', accent: 'var(--ocean-300)' },
    { icon: Clock,        label: 'Awaiting Grade',  value: ungraded,                                        accent: 'var(--ocean-300)' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-4">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `oklch(${stat.accent} / 0.12)`, border: `1px solid oklch(${stat.accent} / 0.25)` }}>
              <Icon className="h-4 w-4" style={{ color: `oklch(${stat.accent})` }} />
            </div>
            <p className="font-display text-2xl font-bold text-[oklch(var(--foreground))]">{stat.value}</p>
            <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}