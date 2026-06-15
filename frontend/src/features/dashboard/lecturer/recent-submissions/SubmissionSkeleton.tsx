import { Skeleton } from '@/components/ui/skeleton'

export function SubmissionSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border p-4"
        >
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}