// src/features/at-risk/components/AtRiskStatsBar.tsx

import { AlertTriangle, AlertCircle, Info, Users } from 'lucide-react'
import type { AtRiskStudent } from '../types/at-risk.types'

interface Props {
  students: AtRiskStudent[]
  isLoading: boolean
}

export function AtRiskStatsBar({ students, isLoading }: Props) {
  const stats = [
    {
      icon: AlertTriangle,
      label: 'High Risk',
      value: students.filter((s) => s.riskLevel === 'high').length,
      accent: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
      iconBg: 'bg-red-500/15',
    },
    {
      icon: AlertCircle,
      label: 'Medium Risk',
      value: students.filter((s) => s.riskLevel === 'medium').length,
      accent: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      iconBg: 'bg-amber-500/15',
    },
    {
      icon: Info,
      label: 'Low Risk',
      value: students.filter((s) => s.riskLevel === 'low').length,
      accent: 'text-[oklch(var(--ocean-300))]',
      bg: 'bg-[oklch(var(--ocean-300)/0.08)] border-[oklch(var(--ocean-300)/0.2)]',
      iconBg: 'bg-[oklch(var(--ocean-300)/0.12)]',
    },
    {
      icon: Users,
      label: 'No Intervention Yet',
      value: students.filter((s) => s.interventions.length === 0).length,
      accent: 'text-[oklch(var(--muted-foreground))]',
      bg: 'bg-[oklch(var(--border)/0.4)] border-[oklch(var(--border))]',
      iconBg: 'bg-[oklch(var(--border)/0.6)]',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-4">
            <div className="mb-2 h-9 w-9 animate-pulse rounded-lg bg-[oklch(var(--border))]" />
            <div className="h-7 w-8 animate-pulse rounded bg-[oklch(var(--border))]" />
            <div className="mt-1 h-3 w-20 animate-pulse rounded bg-[oklch(var(--border))]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={`rounded-xl border p-4 ${stat.bg}`}
          >
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
              <Icon className={`h-4 w-4 ${stat.accent}`} />
            </div>
            <p className={`font-display text-2xl font-bold ${stat.accent}`}>
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}