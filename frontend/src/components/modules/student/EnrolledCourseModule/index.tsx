// src/components/modules/student/EnrolledCoursesModule/index.tsx
'use client'

import { useState } from 'react'
import { Search, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'
import {
  useStudentAnalytics,
  useCourseCatalogue,
  useEnrollMutation,
} from '@/hooks/useStudent'
import { CourseCardSkeleton } from '@/components/ui/ModuleSkeleton'

type Tab = 'enrolled' | 'browse'

function ProgressRing({ pct }: { pct: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width="52" height="52" className="shrink-0 -rotate-90">
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="oklch(var(--border))"
        strokeWidth="4"
      />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="oklch(var(--spark))"
        strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x="26"
        y="26"
        textAnchor="middle"
        dominantBaseline="middle"
        className="origin-center rotate-90 fill-[oklch(var(--foreground))] text-[9px] font-bold"
        
      >
        {pct}%
      </text>
    </svg>
  )
}

export default function EnrolledCoursesModule() {
  const [tab, setTab] = useState<Tab>('enrolled')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: analytics, isLoading: analyticsLoading } = useStudentAnalytics()
  const { data: catalogue, isLoading: catalogueLoading } = useCourseCatalogue(
    page,
    search
  )
  const enroll = useEnrollMutation()

  const enrolled = analytics?.courseProgress ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[oklch(var(--foreground))]">
          Courses
        </h1>
        <p className="mt-1 text-sm text-[oklch(var(--muted-foreground))]">
          {enrolled.length} enrolled ·{' '}
          {enrolled.filter((c) => c.completionPct === 100).length} completed
        </p>
      </div>

      {/* Tabs */}
      <div className="flex w-fit gap-1 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-1">
        {(['enrolled', 'browse'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
              tab === t
                ? 'bg-[oklch(var(--spark)/0.12)] text-[oklch(var(--spark))]'
                : 'text-[oklch(var(--muted-foreground))] hover:text-[oklch(var(--foreground))]'
            }`}
          >
            {t === 'enrolled'
              ? `My Courses (${enrolled.length})`
              : 'Browse Catalogue'}
          </button>
        ))}
      </div>

      {/* Enrolled courses tab */}
      {tab === 'enrolled' && (
        <>
          {analyticsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : enrolled.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[oklch(var(--border))] py-16 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-[oklch(var(--muted-foreground)/0.4)]" />
              <p className="text-sm font-medium text-[oklch(var(--foreground)/0.6)]">
                No courses yet
              </p>
              <p className="mt-1 text-xs text-[oklch(var(--muted-foreground))]">
                Browse the catalogue to find your first course
              </p>
              <button
                onClick={() => setTab('browse')}
                className="mt-4 rounded-full bg-[oklch(var(--spark))] px-5 py-2 text-sm font-semibold text-[oklch(var(--ocean-950))]"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrolled.map((course) => (
                <Link
                  key={course.courseId}
                  href={`/dashboard/courses/${course.courseId}`}
                  className="group flex flex-col rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5 transition-all hover:-translate-y-0.5 hover:border-[oklch(var(--spark)/0.3)]"
                >
                  {/* Progress ring + course info */}
                  <div className="mb-4 flex items-center gap-4">
                    <ProgressRing pct={course.completionPct} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[oklch(var(--foreground))]">
                        {course.title}
                      </p>
                      <p className="text-xs text-[oklch(var(--muted-foreground))]">
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[oklch(var(--border)/0.5)] pt-4">
                    <div>
                      <p className="text-lg font-bold text-[oklch(var(--foreground))]">
                        {course.completedLessons}
                        <span className="text-xs font-normal text-[oklch(var(--muted-foreground))]">
                          /{course.totalLessons}
                        </span>
                      </p>
                      <p className="text-[10px] text-[oklch(var(--muted-foreground))]">
                        Lessons done
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[oklch(var(--foreground))]">
                        {course.avgScore > 0 ? `${course.avgScore}%` : '—'}
                      </p>
                      <p className="text-[10px] text-[oklch(var(--muted-foreground))]">
                        Avg score
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="mt-3">
                    {course.completionPct === 100 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold text-green-400">
                        <Star className="h-2.5 w-2.5" /> Completed
                      </span>
                    ) : course.completionPct > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(var(--spark)/0.1)] px-2.5 py-1 text-[10px] font-semibold text-[oklch(var(--spark))]">
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(var(--border))] px-2.5 py-1 text-[10px] text-[oklch(var(--muted-foreground))]">
                        Not started
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Browse catalogue tab */}
      {tab === 'browse' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex h-11 items-center gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4 focus-within:border-[oklch(var(--spark)/0.5)]">
            <Search className="h-4 w-4 shrink-0 text-[oklch(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="h-full w-full bg-transparent text-sm text-[oklch(var(--foreground))] placeholder-[oklch(var(--muted-foreground)/0.6)] outline-none"
            />
          </div>

          {catalogueLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : catalogue && catalogue.data.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catalogue.data.map((course) => {
                  const isEnrolled = enrolled.some(
                    (e) => e.courseId === course.id
                  )
                  return (
                    <div
                      key={course.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] transition-all hover:-translate-y-0.5 hover:border-[oklch(var(--spark)/0.3)]"
                    >
                      {/* Cover image placeholder */}
                      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-[oklch(var(--ocean-900))] to-[oklch(var(--ocean-800))]">
                        {course.coverImageUrl ? (
                          <img
                            src={course.coverImageUrl}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-10 w-10 text-[oklch(var(--foreground)/0.2)]" />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-sm font-semibold text-[oklch(var(--foreground))]">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-xs text-[oklch(var(--muted-foreground))]">
                          {course.lecturer.firstName} {course.lecturer.lastName}
                        </p>
                        {course.description && (
                          <p className="mt-2 line-clamp-2 text-xs text-[oklch(var(--foreground)/0.6)]">
                            {course.description}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between text-[10px] text-[oklch(var(--muted-foreground))]">
                          <span>{course.enrollmentCount} students</span>
                        </div>

                        <div className="mt-4">
                          {isEnrolled ? (
                            <Link
                              href={`/dashboard/courses/${course.id}`}
                              className="block w-full rounded-lg border border-[oklch(var(--spark)/0.3)] py-2 text-center text-xs font-semibold text-[oklch(var(--spark))]"
                            >
                              Continue Learning
                            </Link>
                          ) : (
                            <button
                              onClick={() => enroll.mutate(course.id)}
                              disabled={enroll.isPending}
                              className="w-full rounded-lg bg-[oklch(var(--spark))] py-2 text-xs font-semibold text-[oklch(var(--ocean-950))] transition-all hover:shadow-[0_0_16px_oklch(var(--spark)/0.3)] disabled:opacity-60"
                            >
                              {enroll.isPending
                                ? 'Enrolling...'
                                : 'Enroll Free'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {catalogue.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-[oklch(var(--border))] px-3 py-1.5 text-xs text-[oklch(var(--foreground))] transition-colors hover:border-[oklch(var(--spark)/0.4)] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-[oklch(var(--muted-foreground))]">
                    {page} / {catalogue.meta.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(catalogue.meta.totalPages, p + 1))
                    }
                    disabled={page === catalogue.meta.totalPages}
                    className="rounded-lg border border-[oklch(var(--border))] px-3 py-1.5 text-xs text-[oklch(var(--foreground))] transition-colors hover:border-[oklch(var(--spark)/0.4)] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="mb-3 h-10 w-10 text-[oklch(var(--muted-foreground)/0.4)]" />
              <p className="text-sm text-[oklch(var(--foreground)/0.6)]">
                {search
                  ? `No courses found for "${search}"`
                  : 'No courses available yet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
