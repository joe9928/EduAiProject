// src/features/grading/components/GradeSummaryRow.tsx

import { getLetterGrade, getGradeColour } from '../types/gradebook.types'
import type { StudentGradeSummary } from '../types/gradebook.types'

interface Props { summary: StudentGradeSummary }

export function GradeSummaryRow({ summary }: Props) {
  const { weightedAverage, letterGrade, gradeCount, totalAssignments, missingCount } = summary

  if (weightedAverage === null) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-0.5">
        <span className="text-xs font-semibold text-[oklch(var(--muted-foreground)/0.4)]">—</span>
        <span className="text-[9px] text-[oklch(var(--muted-foreground)/0.3)]">No grades</span>
      </div>
    )
  }

  const colourClass = getGradeColour(weightedAverage)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-0.5">
      <div className="flex items-baseline gap-1">
        <span className={`text-sm font-bold ${colourClass}`}>{weightedAverage.toFixed(0)}%</span>
        <span className={`text-[10px] font-semibold ${colourClass}`}>{letterGrade}</span>
      </div>
      <span className="text-[9px] text-[oklch(var(--muted-foreground)/0.5)]">
        {gradeCount}/{totalAssignments}
        {missingCount > 0 && <span className="ml-1 text-red-400/70">{missingCount}✗</span>}
      </span>
    </div>
  )
}