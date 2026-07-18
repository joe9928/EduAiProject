// src/features/at-risk/components/RiskStudentDetail.tsx
'use client'

import { X, BookOpen, TrendingUp, Activity, Clock } from 'lucide-react'
import { RiskScoreBadge } from './RiskScoreBadge'
import { RiskFactorList } from './RiskFactorList'
import { InterventionTimeline } from './InterventionTimeline'
import { InterventionForm } from './InterventionForm'
import type { AtRiskStudent } from '../types/at-risk.types'

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

// ─── Empty prompt ─────────────────────────────────────────────────────────────

function NoStudentSelected() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[oklch(var(--border))] bg-[oklch(var(--card))]">
        <BookOpen className="h-6 w-6 text-[oklch(var(--muted-foreground)/0.4)]" />
      </div>
      <p className="text-sm font-medium text-[oklch(var(--foreground)/0.6)]">
        Select a student to view their risk profile
      </p>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  student: AtRiskStudent | null
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RiskStudentDetail({ student, onClose }: Props) {
  if (!student) return <NoStudentSelected />

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between border-b border-[oklch(var(--border))] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[oklch(var(--spark)/0.1)] border border-[oklch(var(--spark)/0.2)] text-xs font-semibold text-[oklch(var(--spark))]">
            {getInitials(student.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[oklch(var(--foreground))]">
              {student.name}
            </p>
            <p className="text-xs text-[oklch(var(--muted-foreground))]">
              {student.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RiskScoreBadge level={student.riskLevel} size="md" />
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[oklch(var(--border))] text-[oklch(var(--muted-foreground))] transition-colors hover:border-[oklch(var(--spark)/0.3)] hover:text-[oklch(var(--foreground))]"
            aria-label="Close detail panel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Course + quick stats */}
        <div className="border-b border-[oklch(var(--border))] px-5 py-4 space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[oklch(var(--muted-foreground)/0.6)]">
              Course
            </p>
            <p className="mt-0.5 text-sm font-medium text-[oklch(var(--foreground))]">
              {student.courseTitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: TrendingUp,
                label: 'Overall Grade',
                value: student.overallGrade !== null ? `${student.overallGrade}%` : '—',
              },
              {
                icon: Activity,
                label: 'Completion',
                value: `${student.assignmentCompletion}%`,
              },
              {
                icon: Clock,
                label: 'Engagement',
                value: `${student.engagementScore}%`,
              },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-lg border border-[oklch(var(--border)/0.5)] bg-[oklch(var(--background))] py-2.5 px-2 text-center"
                >
                  <Icon className="mb-1 h-3.5 w-3.5 text-[oklch(var(--muted-foreground)/0.5)]" />
                  <p className="font-display text-sm font-bold text-[oklch(var(--foreground))]">
                    {stat.value}
                  </p>
                  <p className="text-[9px] text-[oklch(var(--muted-foreground)/0.6)]">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contributing factors — the explainable AI section */}
        <div className="border-b border-[oklch(var(--border))] px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[oklch(var(--muted-foreground)/0.6)]">
            Contributing Factors
          </p>
          <RiskFactorList factors={student.riskFactors} />
        </div>

        {/* Intervention timeline */}
        <div className="border-b border-[oklch(var(--border))] px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[oklch(var(--muted-foreground)/0.6)]">
            Intervention History ({student.interventions.length})
          </p>
          <InterventionTimeline interventions={student.interventions} />
        </div>

        {/* Log new intervention */}
        <div className="px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[oklch(var(--muted-foreground)/0.6)]">
            Log Intervention
          </p>
          <InterventionForm studentId={student.id} />
        </div>
      </div>
    </div>
  )
}