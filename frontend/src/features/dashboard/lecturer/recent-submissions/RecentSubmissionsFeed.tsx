'use client'

import Link from 'next/link'

import {
  ArrowRight,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import type {
  SubmissionSummary,
} from './types'

import {
  SubmissionCard,
} from './SubmissionCard'

import {
  SubmissionSkeleton,
} from './SubmissionSkeleton'

import {
  EmptySubmissionsState,
} from './EmptySubmissionsState'

interface Props {
  submissions: SubmissionSummary[]
  isLoading: boolean
}

export function RecentSubmissionsFeed({
  submissions,
  isLoading,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>
            Recent Submissions
          </CardTitle>

          <CardDescription>
            Review and grade student work
          </CardDescription>
        </div>

        <Link
          href="/submissions"
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          View Queue

          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <SubmissionSkeleton />
        ) : submissions.length ===
          0 ? (
          <EmptySubmissionsState />
        ) : (
          <div className="space-y-4">
            {submissions.map(
              (
                submission,
                index
              ) => (
                <SubmissionCard
                  key={
                    submission.id
                  }
                  submission={
                    submission
                  }
                  index={
                    index
                  }
                />
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}