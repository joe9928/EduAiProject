// src/features/grading/lecturer/LecturerGradeBookView.tsx
'use client'

import { useState, useMemo } from 'react'
import { useGradeBook } from '../hooks/useGradeBook'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { GradeGrid, GradeGridSkeleton } from '../components/GradeGrid'
import { GradeBookFilters } from '../components/GradeBookFilters'
import { GradeBookStatsBar } from '../components/GradeBookStatsBar'
import type { GradeBookFilters as GradeBookFiltersType } from '../types/gradebook.types'
import { BookOpen } from 'lucide-react'

const DEFAULT_FILTERS: GradeBookFiltersType = {
  courseId: '',
  search:   '',
}

// ─── Empty/prompt state ───────────────────────────────────────────────────────

function NoCourseSelected() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[oklch(var(--spark)/0.15)] bg-[oklch(var(--spark)/0.06)]">
        <BookOpen className="h-7 w-7 text-[oklch(var(--spark)/0.5)]" />
      </div>
      <h3 className="font-display text-base font-semibold text-[oklch(var(--foreground))]">
        Select a course to view the grade book
      </h3>
      <p className="mt-1.5 max-w-xs text-sm text-[oklch(var(--muted-foreground))]">
        Choose one of your published courses from the dropdown above to see all
        student grades in one place.
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LecturerGradeBookView() {
  const [filters, setFilters] = useState<GradeBookFiltersType>(DEFAULT_FILTERS)

  const { data: courses = [],   isLoading: coursesLoading } = useCourses()
  const { data: gradeBook,      isLoading: gradeBookLoading, error } =
    useGradeBook(filters.courseId)

  const isLoading = coursesLoading || (!!filters.courseId && gradeBookLoading)

  // Client-side student search filter
  const filteredStudents = useMemo(() => {
    if (!gradeBook) return []
    if (!filters.search.trim()) return gradeBook.students

    const q = filters.search.toLowerCase()
    return gradeBook.students.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    )
  }, [gradeBook, filters.search])

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[oklch(var(--foreground))] md:text-3xl">
          Grade Book
        </h1>
        <p className="mt-1 text-sm text-[oklch(var(--muted-foreground))]">
          View and manage all student grades across assignments in one place.
        </p>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <GradeBookFilters
        filters={filters}
        courses={courses}
        onChange={setFilters}
      />

      {/* ── Stats bar — only shown when a course is loaded ────────────────────── */}
      {gradeBook && !isLoading && (
        <GradeBookStatsBar gradeBook={gradeBook} isLoading={false} />
      )}
      {isLoading && filters.courseId && (
        <GradeBookStatsBar gradeBook={{} as any} isLoading={true} />
      )}

      {/* ── Keyboard hint ─────────────────────────────────────────────────────── */}
      {gradeBook && !isLoading && (
        <p className="hidden text-[10px] text-[oklch(var(--muted-foreground)/0.5)] sm:block">
          Click any cell to edit ·{' '}
          <kbd className="rounded border border-[oklch(var(--border))] px-1 font-mono">↑↓←→</kbd>
          {' '}navigate ·{' '}
          <kbd className="rounded border border-[oklch(var(--border))] px-1 font-mono">Enter</kbd>
          {' '}confirm & move down ·{' '}
          <kbd className="rounded border border-[oklch(var(--border))] px-1 font-mono">Tab</kbd>
          {' '}confirm & move right ·{' '}
          <kbd className="rounded border border-[oklch(var(--border))] px-1 font-mono">Esc</kbd>
          {' '}cancel
        </p>
      )}

      {/* ── Student count ─────────────────────────────────────────────────────── */}
      {gradeBook && !isLoading && filters.search && (
        <p className="text-xs text-[oklch(var(--muted-foreground))]">
          {filteredStudents.length === gradeBook.students.length
            ? `${gradeBook.students.length} students`
            : `${filteredStudents.length} of ${gradeBook.students.length} students`}
        </p>
      )}

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      {!filters.courseId ? (
        <NoCourseSelected />
      ) : isLoading ? (
        <GradeGridSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 py-12 text-center">
          <p className="text-sm font-medium text-red-400">
            Failed to load grade book
          </p>
          <p className="mt-1 text-xs text-[oklch(var(--muted-foreground))]">
            Please try selecting the course again.
          </p>
        </div>
      ) : gradeBook ? (
        <GradeGrid
          gradeBook={gradeBook}
          filteredStudents={filteredStudents}
        />
      ) : null}
    </div>
  )
}