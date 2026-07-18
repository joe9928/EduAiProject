// src/features/at-risk/components/RiskStudentRow.tsx
'use client'

import { formatDistanceToNow } from 'date-fns'
import { RiskScoreBadge } from './RiskScoreBadge'
import type { AtRiskStudent } from '../types/at-risk.types'

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

interface Props {
  student:    AtRiskStudent
  isSelected: boolean
  onClick:    () => void
}

export function RiskStudentRow({ student, isSelected, onClick }: Props) {
  const hasIntervention = student.interventions.length > 0

  return (
    <button
      onClick={onClick}
      aria-selected={isSelected}
      role="row"
      className={`w-full border-b border-[oklch(var(--border)/0.5)] px-4 py-3.5 text-left transition-colors last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--spark)/0.4)] focus-visible:ring-inset ${
        isSelected
          ? 'bg-[oklch(var(--spark)/0.06)] border-l-2 border-l-[oklch(var(--spark))]'
          : 'hover:bg-[oklch(var(--foreground)/0.03)]'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(var(--spark)/0.1)] text-[10px] font-semibold text-[oklch(var(--spark))]">
            {getInitials(student.name)}
          </div>
          {/* Intervention dot */}
          {hasIntervention && (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[oklch(var(--card))] bg-[oklch(var(--spark))]"
              title="Intervention logged"
            />
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${
            isSelected ? 'text-[oklch(var(--spark))]' : 'text-[oklch(var(--foreground))]'
          }`}>
            {student.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-[oklch(var(--muted-foreground))]">
            {student.courseTitle}
          </p>
        </div>

        {/* Right: badge + last active */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <RiskScoreBadge level={student.riskLevel} />
          <span className="text-[10px] text-[oklch(var(--muted-foreground)/0.5)]">
            {formatDistanceToNow(new Date(student.lastActive), { addSuffix: true })}
          </span>
        </div>
      </div>
    </button>
  )
}