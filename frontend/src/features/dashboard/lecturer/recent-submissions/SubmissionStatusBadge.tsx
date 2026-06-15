import { Badge } from '@/components/ui/badge'

import {
  STATUS_CONFIG,
} from './submission-config'

import type {
  SubmissionStatus,
} from './types'

interface Props {
  status: SubmissionStatus
}

export function SubmissionStatusBadge({
  status,
}: Props) {
  const config =
    STATUS_CONFIG[status]

  const Icon = config.icon

  return (
    <Badge
      variant={config.variant}
      className="gap-1"
    >
      <Icon className="h-3 w-3" />

      {config.label}
    </Badge>
  )
}