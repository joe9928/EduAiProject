import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptySubmissionsState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="font-semibold">
        You're all caught up
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        There are currently no submissions
        waiting for review.
      </p>

      <Button
        variant="outline"
        className="mt-4"
      >
        View Gradebook
      </Button>
    </div>
  )
}