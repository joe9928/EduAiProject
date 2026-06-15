'use client'

import Link from 'next/link'

import { motion } from 'framer-motion'

import { formatDistanceToNow } from 'date-fns'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

import {
  Card,
  CardContent,
} from '@/components/ui/card'

import {
  Separator,
} from '@/components/ui/separator'

import type {
  SubmissionSummary,
} from './types'

import {
  getInitials,
  getSubmissionPriority,
} from './utils'

import {
  SubmissionActions,
} from './SubmissionActions'

import {
  SubmissionStatusBadge,
} from './SubmissionStatusBadge'

import {
  SubmissionPriorityIndicator,
} from './SubmissonPriorityIndicator'

interface Props {
  submission: SubmissionSummary
  index: number
}

export function SubmissionCard({
  submission,
  index,
}: Props) {
  const priority =
    getSubmissionPriority(
      submission
    )

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay:
          index * 0.05,
        duration: 0.25,
      }}
      whileHover={{
        y: -2,
      }}
    >
      <Card className="transition-all hover:shadow-md">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src={
                  submission.studentAvatar ??
                  undefined
                }
              />

              <AvatarFallback>
                {getInitials(
                  submission.studentName
                )}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap gap-2">
                <SubmissionStatusBadge
                  status={
                    submission.status
                  }
                />

                <SubmissionPriorityIndicator
                  priority={
                    priority
                  }
                />
              </div>

              <Link
                href={`/submissions/${submission.id}`}
              >
                <h3 className="truncate font-semibold hover:text-primary">
                  {
                    submission.studentName
                  }
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground">
                {
                  submission.courseTitle
                }
              </p>

              <p className="truncate text-sm">
                {
                  submission.assignmentTitle
                }
              </p>
            </div>

            <time className="text-xs text-muted-foreground">
              {formatDistanceToNow(
                new Date(
                  submission.submittedAt
                ),
                {
                  addSuffix: true,
                }
              )}
            </time>
          </div>

          <Separator />

          <SubmissionActions
            submissionId={
              submission.id
            }
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}