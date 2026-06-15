import {
  SubmissionPriority,
  SubmissionSummary,
} from './types'

import { STATUS_CONFIG } from './submission-config'

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function getSubmissionPriority(
  submission: SubmissionSummary
): SubmissionPriority {
  return STATUS_CONFIG[
    submission.status
  ].priority
}