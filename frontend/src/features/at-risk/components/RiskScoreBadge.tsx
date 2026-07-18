// src/features/at-risk/components/RiskScoreBadge.tsx
// Never renders a raw number — always a labelled level with icon.

import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { RISK_CONFIG } from '../types/at-risk.types'
import type { RiskLevel } from '../types/at-risk.types'

const ICONS: Record<RiskLevel, React.ComponentType<{ className?: string }>> = {
  high:   AlertTriangle,
  medium: AlertCircle,
  low:    Info,
}

interface Props {
  level: RiskLevel
  size?: 'sm' | 'md'
}

export function RiskScoreBadge({ level, size = 'sm' }: Props) {
  const config = RISK_CONFIG[level]
  const Icon   = ICONS[level]

  const sizeClass = size === 'md'
    ? 'px-3 py-1 text-xs gap-1.5'
    : 'px-2 py-0.5 text-[10px] gap-1'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${sizeClass} ${config.bgClass} ${config.borderClass} ${config.textClass}`}
    >
      <Icon className={size === 'md' ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'} />
      {config.label}
    </span>
  )
}