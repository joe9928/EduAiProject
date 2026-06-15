// src/features/dashboard/lecturer/RecentSubmissionsFeed.tsx
'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Clock, ArrowRight, FileText } from 'lucide-react'
import { ListSkeleton } from '@/components/ui/redesigns/Skeletons'
import type { SubmissionSummary } from './types'

// ─── Status config ────────────────────────────────────────────────────────────
// Maps each submission status to a dot colour and label that renders
// consistently without relying on Shadcn Badge variants.

type StatusConfig = {
  label: string
  dotClass: string
  textClass: string
}

const STATUS_CONFIG: Record<SubmissionSummary['status'], StatusConfig> = {
  pending: {
    label: 'Pending',
    dotClass: 'bg-amber-400',
    textClass: 'text-amber-400',
  },
  graded: {
    label: 'Graded',
    dotClass: 'bg-[oklch(var(--spark)/0.8)]',
    textClass: 'text-[oklch(var(--spark))]',
  },
  late: {
    label: 'Late',
    dotClass: 'bg-red-400',
    textClass: 'text-red-400',
  },
  resubmitted: {
    label: 'Resubmitted',
    dotClass: 'bg-[oklch(var(--ocean-300)/0.8)]',
    textClass: 'text-[oklch(var(--ocean-300))]',
  },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RecentSubmissionsFeedProps {
  submissions: SubmissionSummary[]
  isLoading: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RecentSubmissionsFeed({
  submissions,
  isLoading,
}: RecentSubmissionsFeedProps) {
  return (
    <div className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[oklch(var(--foreground))]">
          Recent Submissions
        </h2>
        <Link
          href="/dashboard/submissions"
          className="flex items-center gap-1 text-xs text-[oklch(var(--spark))] transition-opacity hover:opacity-75"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* States */}
      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="mb-2 h-8 w-8 text-[oklch(var(--muted-foreground)/0.4)]" />
          <p className="text-sm text-[oklch(var(--foreground)/0.6)]">
            No pending submissions
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-0 divide-y divide-[oklch(var(--border)/0.5)]">
          {submissions.map((submission) => {
            const status = STATUS_CONFIG[submission.status]
            return (
              <li key={submission.id}>
                <Link
                  href={`/dashboard/submissions/${submission.id}`}
                  className="group flex items-center gap-3 py-3 transition-opacity hover:opacity-80 first:pt-0 last:pb-0"
                >
                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[oklch(var(--spark)/0.1)] text-xs font-semibold text-[oklch(var(--spark))] transition-colors group-hover:bg-[oklch(var(--spark)/0.18)]">
                    {getInitials(submission.studentName)}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[oklch(var(--foreground))]">
                      {submission.studentName}
                    </p>
                    <p className="truncate text-xs text-[oklch(var(--muted-foreground))]">
                      {submission.courseTitle} · {submission.assignmentTitle}
                    </p>
                  </div>

                  {/* Status + time */}
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`flex items-center gap-1 text-[10px] font-semibold ${status.textClass}`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${status.dotClass}`}
                      />
                      {status.label}
                    </span>
                    <span className="text-[10px] text-[oklch(var(--muted-foreground))]">
                      {formatDistanceToNow(new Date(submission.submittedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}