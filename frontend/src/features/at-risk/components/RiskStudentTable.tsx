// src/features/at-risk/components/RiskStudentTable.tsx

import { RiskStudentRow } from './RiskStudentRow'
import { RISK_CONFIG } from '../types/at-risk.types'
import type { AtRiskStudent, RiskLevel } from '../types/at-risk.types'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-[oklch(var(--border)/0.5)] px-4 py-3.5 last:border-0">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-[oklch(var(--border))]" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-28 animate-pulse rounded bg-[oklch(var(--border))]" />
        <div className="h-3 w-40 animate-pulse rounded bg-[oklch(var(--border))]" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <div className="h-5 w-20 animate-pulse rounded-full bg-[oklch(var(--border))]" />
        <div className="h-2.5 w-14 animate-pulse rounded bg-[oklch(var(--border))]" />
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="mb-3 text-4xl" aria-hidden>✅</span>
      <p className="text-sm font-semibold text-[oklch(var(--foreground))]">
        {isFiltered ? 'No students match your filters' : 'No at-risk students'}
      </p>
      <p className="mt-1 text-xs text-[oklch(var(--muted-foreground))]">
        {isFiltered
          ? 'Try adjusting your filters.'
          : 'All students are currently on track.'}
      </p>
    </div>
  )
}

// ─── Group order ──────────────────────────────────────────────────────────────

const GROUP_ORDER: RiskLevel[] = ['high', 'medium', 'low']

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  students:   AtRiskStudent[]
  selectedId: string | null
  isLoading:  boolean
  isFiltered: boolean
  onSelect:   (student: AtRiskStudent) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RiskStudentTable({
  students,
  selectedId,
  isLoading,
  isFiltered,
  onSelect,
}: Props) {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
      </div>
    )
  }

  if (students.length === 0) {
    return <EmptyState isFiltered={isFiltered} />
  }

  // Group by risk level in priority order
  const grouped = GROUP_ORDER.reduce<Record<RiskLevel, AtRiskStudent[]>>(
    (acc, level) => {
      acc[level] = students.filter((s) => s.riskLevel === level)
      return acc
    },
    { high: [], medium: [], low: [] }
  )

  return (
    <div role="grid" aria-label="At-risk students list">
      {GROUP_ORDER.map((level) => {
        const group = grouped[level]
        if (group.length === 0) return null
        const config = RISK_CONFIG[level]

        return (
          <div key={level}>
            {/* Group label */}
            <div className="sticky top-0 z-10 border-b border-[oklch(var(--border)/0.5)] bg-[oklch(var(--card))] px-4 py-2">
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${config.textClass}`}>
                {config.label} · {group.length}
              </p>
            </div>

            {group.map((student) => (
              <RiskStudentRow
                key={student.id}
                student={student}
                isSelected={selectedId === student.id}
                onClick={() => onSelect(student)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}