// src/features/at-risk/components/InterventionTimeline.tsx

import { formatDistanceToNow, format } from 'date-fns'
import { INTERVENTION_CONFIG } from '../types/at-risk.types'
import type { Intervention } from '../types/at-risk.types'

interface Props {
  interventions: Intervention[]
}

export function InterventionTimeline({ interventions }: Props) {
  if (interventions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-[oklch(var(--border)/0.5)] bg-[oklch(var(--background))] py-6 text-center">
        <p className="text-xs font-medium text-[oklch(var(--foreground)/0.5)]">
          No interventions logged yet
        </p>
        <p className="mt-0.5 text-[10px] text-[oklch(var(--muted-foreground)/0.5)]">
          Use the form below to log your first action
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col gap-0">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[oklch(var(--border)/0.6)]" />

      {interventions.map((intervention, i) => {
        const config = INTERVENTION_CONFIG[intervention.type]
        return (
          <div key={intervention.id} className="relative flex gap-3 pb-4 last:pb-0">
            {/* Icon dot */}
            <div
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[oklch(var(--border))] text-sm ${config.bgClass}`}
              aria-hidden
            >
              {config.icon}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-semibold ${config.textClass}`}>
                  {config.label}
                </span>
                <time
                  dateTime={intervention.createdAt}
                  className="shrink-0 text-[10px] text-[oklch(var(--muted-foreground)/0.5)]"
                  title={format(new Date(intervention.createdAt), 'PPP p')}
                >
                  {formatDistanceToNow(new Date(intervention.createdAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
              <p className="mt-1 text-xs text-[oklch(var(--foreground)/0.75)] leading-relaxed">
                {intervention.note}
              </p>
              <p className="mt-0.5 text-[10px] text-[oklch(var(--muted-foreground)/0.5)]">
                by {intervention.createdBy}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}