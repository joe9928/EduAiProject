'use client'

import Link from 'next/link'

import {
  Eye,
  PenSquare,
} from 'lucide-react'

import {
  Button,
} from '@/components/ui/button'

interface Props {
  submissionId: string
}

export function SubmissionActions({
  submissionId,
}: Props) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        asChild
      >
        <Link
          href={`/submissions/${submissionId}`}
        >
          <Eye className="mr-1 h-4 w-4" />

          View
        </Link>
      </Button>

      <Button
        size="sm"
        asChild
      >
        <Link
          href={`/submissions/${submissionId}/grade`}
        >
          <PenSquare className="mr-1 h-4 w-4" />

          Grade
        </Link>
      </Button>
    </div>
  )
}