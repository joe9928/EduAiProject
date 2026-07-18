// src/features/at-risk/components/RiskFactorList.tsx
// Renders the "why is this student at risk" explanation.
// This is the explainable AI section — factors with icons, labels, and details.

import { RISK_CONFIG, FACTOR_ICONS } from '../types/at-risk.types'
import type { RiskFactor } from '../types/at-risk.types'

interface Props {
  factors: RiskFactor[]
}

export function RiskFactorList({ factors }: Props) {
  if (factors.length === 0) {
    return (
      <p className="text-xs text-[oklch(var(--muted-foreground))]">
        No contributing factors recorded.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {factors.map((factor, i) => {
        const config = RISK_CONFIG[factor.severity]
        return (
          <div
            key={i}
            className={`rounded-lg border p-3 ${config.bgClass} ${config.borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-base leading-none" aria-hidden>
                {FACTOR_ICONS[factor.type]}
              </span>
              <div>
                <p className={`text-xs font-semibold ${config.textClass}`}>
                  {factor.label}
                </p>
                <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">
                  {factor.detail}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}