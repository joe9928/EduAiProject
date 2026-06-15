import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RotateCcw,
} from 'lucide-react'

import type {
  SubmissionPriority,
  SubmissionStatus,
} from './types'

export const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    label: string
    icon: any
    variant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
    priority: SubmissionPriority
  }
> = {
  pending: {
    label: 'Pending Review',
    icon: Clock3,
    variant: 'secondary',
    priority: 'medium',
  },

  late: {
    label: 'Late Submission',
    icon: AlertTriangle,
    variant: 'destructive',
    priority: 'high',
  },

  graded: {
    label: 'Graded',
    icon: CheckCircle2,
    variant: 'outline',
    priority: 'low',
  },

  resubmitted: {
    label: 'Resubmitted',
    icon: RotateCcw,
    variant: 'default',
    priority: 'medium',
  },
}

export const PRIORITY_CONFIG = {
  high: {
    label: 'Needs Attention',
    className:
      'border-red-500/20 bg-red-500/10 text-red-500',
  },

  medium: {
    label: 'Review Soon',
    className:
      'border-amber-500/20 bg-amber-500/10 text-amber-500',
  },

  low: {
    label: 'Completed',
    className:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  },
}