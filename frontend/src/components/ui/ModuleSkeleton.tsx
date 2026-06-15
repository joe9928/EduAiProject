// src/components/ui/ModuleSkeleton.tsx
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] ${className}`}
    />
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} className="h-28" />
      ))}
    </div>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-4">
      <div className="mb-3 h-32 rounded-lg bg-[oklch(var(--border))]" />
      <div className="mb-2 h-4 w-3/4 rounded bg-[oklch(var(--border))]" />
      <div className="h-3 w-1/2 rounded bg-[oklch(var(--border)/0.5)]" />
      <div className="mt-4 h-1.5 w-full rounded-full bg-[oklch(var(--border)/0.5)]" />
    </div>
  )
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center gap-4 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-3.5"
        >
          <div className="h-10 w-10 shrink-0 rounded-lg bg-[oklch(var(--border))]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-[oklch(var(--border))]" />
            <div className="h-3 w-1/2 rounded bg-[oklch(var(--border)/0.5)]" />
          </div>
        </div>
      ))}
    </div>
  )
}