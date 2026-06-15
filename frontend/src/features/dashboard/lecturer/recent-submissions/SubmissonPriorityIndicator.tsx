import { PRIORITY_CONFIG } from './submission-config'

import type {
  SubmissionPriority,
} from './types'

interface Props {
  priority: SubmissionPriority
}

export function SubmissionPriorityIndicator({
  priority,
}: Props) {
  const config =
    PRIORITY_CONFIG[priority]

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  )
}
