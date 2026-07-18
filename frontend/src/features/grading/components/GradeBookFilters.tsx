// src/features/grading/components/GradeBookFilters.tsx
'use client'

import { Search, X } from 'lucide-react'
import type { GradeBookFilters } from '../types/gradebook.types'
import type { LecturerCourse } from '@/features/courses/types/course.types'

interface Props { filters: GradeBookFilters; courses: LecturerCourse[]; onChange: (f: GradeBookFilters) => void }

export function GradeBookFilters({ filters, courses, onChange }: Props) {
  const set = (partial: Partial<GradeBookFilters>) => onChange({ ...filters, ...partial })
  const publishedCourses = courses.filter((c) => c.status === 'published')

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select value={filters.courseId} onChange={(e) => set({ courseId: e.target.value, search: '' })}
        className="h-9 rounded-lg border border-[oklch(var(--border))] bg-[oklch(var(--background))] px-3 text-sm text-[oklch(var(--foreground))] outline-none transition-colors focus:border-[oklch(var(--spark)/0.5)] cursor-pointer"
        aria-label="Select course">
        <option value="">Select a course...</option>
        {publishedCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[oklch(var(--muted-foreground))]" />
        <input type="text" value={filters.search} onChange={(e) => set({ search: e.target.value })}
          placeholder="Search students..." disabled={!filters.courseId}
          className="h-9 w-52 rounded-lg border border-[oklch(var(--border))] bg-[oklch(var(--background))] pl-9 pr-9 text-sm text-[oklch(var(--foreground))] placeholder:text-[oklch(var(--muted-foreground))] outline-none transition-colors focus:border-[oklch(var(--spark)/0.5)] focus:ring-1 focus:ring-[oklch(var(--spark)/0.2)] disabled:opacity-40 disabled:cursor-not-allowed" />
        {filters.search && (
          <button onClick={() => set({ search: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[oklch(var(--muted-foreground))] hover:text-[oklch(var(--foreground))]" aria-label="Clear search">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}