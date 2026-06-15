// src/components/ui/redesigns/Skeletons.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// ── Stat card skeleton — matches our 2×2 / 4-col stat grids ──
export function StatCardSkeleton() {
  return (
    <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
      <CardContent className="p-4">
        <Skeleton className="mb-3 h-9 w-9 rounded-lg" />
        <Skeleton className="mb-1.5 h-8 w-16" />
        <Skeleton className="mb-1 h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )
}

// ── Four stat cards in a row — matches dashboard overview grid ──
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ── Course card skeleton — matches the enrolled/catalogue cards ──
export function CourseCardSkeleton() {
  return (
    <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))] overflow-hidden">
      <Skeleton className="h-32 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

// ── Horizontal list item skeleton — matches course/activity rows ──
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-3.5">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-1 w-full rounded-full" />
      </div>
      <Skeleton className="h-5 w-8 shrink-0" />
    </div>
  )
}

// ── Stacked list of row skeletons ──
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  )
}

// ── Notification/activity item — smaller, no progress bar ──
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-3 py-1">
      <Skeleton className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </div>
  )
}

// ── Deadline/pill item ──
export function DeadlineSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[oklch(var(--border)/0.5)] px-3 py-2.5">
      <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
      <Skeleton className="h-3 w-10 shrink-0" />
    </div>
  )
}

// ── Recommendation card skeleton ──
export function RecommendationSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--background))] p-3.5">
      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

// ── Full section skeleton — heading + content placeholder ──
export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5">
      <CardHeader className="p-0 pb-4">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="p-0">
        <ListSkeleton rows={rows} />
      </CardContent>
    </Card>
  )
}

// ── Dashboard home full-page skeleton ──
export function DashboardHomeSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome heading */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats row */}
      <StatsSkeleton />

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <SectionSkeleton rows={3} />
        <div className="flex flex-col gap-4">
          <SectionSkeleton rows={2} />
          <SectionSkeleton rows={2} />
        </div>
      </div>
    </div>
  )
}