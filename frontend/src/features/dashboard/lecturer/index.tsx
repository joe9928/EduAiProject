// src/features/dashboard/lecturer/index.tsx
'use client'

import {
  BookOpen,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useGreeting } from '@/hooks/useDashboard'
import { StatsSkeleton, ListSkeleton } from '@/components/ui/redesigns/Skeletons'
import { RecentSubmissionsFeed } from './recent-submissions/RecentSubmissionsFeed'
import { useLecturerAnalytics, usePendingSubmissions } from '@/hooks/useLecturerDashboard'

// ─── Quick actions config ─────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: 'My Courses',
    description: 'Manage your course catalogue',
    icon: BookOpen,
    href: '/dashboard/courses',
    accent: 'var(--spark)',
  },
  {
    label: 'Submissions',
    description: 'Review & grade student work',
    icon: Clock,
    href: '/dashboard/submissions',
    accent: 'var(--ocean-300)',
  },
  {
    label: 'At-Risk Students',
    description: 'Students needing intervention',
    icon: AlertTriangle,
    href: '/dashboard/at-risk',
    accent: 'var(--spark)',
  },
  {
    label: 'Grade Book',
    description: 'View all grades at a glance',
    icon: TrendingUp,
    href: '/dashboard/grades',
    accent: 'var(--ocean-300)',
  },
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export default function LecturerDashboardHome() {
  const { greeting, firstName } = useGreeting()
  const { data: analytics, isLoading: analyticsLoading } = useLecturerAnalytics()
  const { data: submissions, isLoading: submissionsLoading } = usePendingSubmissions()

  // ── Derived values ──────────────────────────────────────────────────────────

  const pendingCount = analytics?.pendingSubmissions ?? 0
  const atRiskCount = analytics?.atRiskStudents ?? 0
  const totalStudents = analytics?.totalStudents ?? 0
  const atRiskPct =
    totalStudents > 0 ? Math.round((atRiskCount / totalStudents) * 100) : 0

  const hasPendingAlert = pendingCount > 10
  const hasAtRiskAlert = atRiskCount > 0

  // ── Stat cards ──────────────────────────────────────────────────────────────

  const stats = analytics
    ? [
        {
          icon: BookOpen,
          label: 'Active Courses',
          value: analytics.activeCourses.toString(),
          sub: 'currently running',
          accent: 'var(--spark)',
          href: '/dashboard/courses',
        },
        {
          icon: Users,
          label: 'Total Students',
          value: analytics.totalStudents.toString(),
          sub: 'across all courses',
          accent: 'var(--ocean-300)',
          href: undefined,
        },
        {
          icon: Clock,
          label: 'Pending Review',
          value: analytics.pendingSubmissions.toString(),
          sub: 'submissions awaiting grade',
          accent: 'var(--spark)',
          href: '/dashboard/submissions',
        },
        {
          icon: TrendingUp,
          label: 'Average Grade',
          value: `${analytics.averageGrade.toFixed(1)}%`,
          sub: 'across all assessments',
          accent: 'var(--ocean-300)',
          href: '/dashboard/grades',
        },
        {
          icon: AlertTriangle,
          label: 'At-Risk Students',
          value: analytics.atRiskStudents.toString(),
          sub: `${atRiskPct}% of your cohort`,
          accent: 'var(--spark)',
          href: '/dashboard/at-risk',
        },
        {
          icon: CheckCircle2,
          label: 'Graded This Week',
          value: analytics.gradedThisWeek.toString(),
          sub: 'submissions completed',
          accent: 'var(--ocean-300)',
          href: undefined,
        },
      ]
    : []

  // ── Subtitle logic ──────────────────────────────────────────────────────────

  const alertCount = [hasPendingAlert, hasAtRiskAlert].filter(Boolean).length
  const subtitle =
    alertCount > 0
      ? `${alertCount} area${alertCount > 1 ? 's' : ''} need${alertCount === 1 ? 's' : ''} your attention today.`
      : "Everything looks good. Keep up the great work!"

  return (
    <div className="space-y-6">

      {/* ── Welcome header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[oklch(var(--foreground))] md:text-3xl">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-[oklch(var(--muted-foreground))]">
            {subtitle}
          </p>
        </div>
        <span className="hidden rounded-full border border-[oklch(var(--ocean-300)/0.25)] bg-[oklch(var(--ocean-300)/0.08)] px-3 py-1 text-xs font-medium text-[oklch(var(--ocean-300))] sm:block">
          Lecturer
        </span>
      </div>

      {/* ── Alert banners ───────────────────────────────────────────────────── */}
      {(hasPendingAlert || hasAtRiskAlert) && !analyticsLoading && (
        <div className="flex flex-col gap-2">
          {hasPendingAlert && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-300">
                  Submissions Backlog
                </p>
                <p className="mt-0.5 text-xs text-amber-300/80">
                  {pendingCount} submissions are waiting to be graded.{' '}
                  <Link
                    href="/dashboard/submissions"
                    className="font-medium underline underline-offset-2 hover:opacity-75"
                  >
                    Review now →
                  </Link>
                </p>
              </div>
            </div>
          )}

          {hasAtRiskAlert && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-300">
                  Students Need Attention
                </p>
                <p className="mt-0.5 text-xs text-red-300/80">
                  {atRiskCount} student{atRiskCount > 1 ? 's are' : ' is'} flagged at risk ({atRiskPct}% of your cohort).{' '}
                  <Link
                    href="/dashboard/at-risk"
                    className="font-medium underline underline-offset-2 hover:opacity-75"
                  >
                    View dashboard →
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Stats grid ──────────────────────────────────────────────────────── */}
      {analyticsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            const inner = (
              <div
                key={stat.label}
                className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-4 transition-colors hover:border-[oklch(var(--spark)/0.3)]"
              >
                <div
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    background: `oklch(${stat.accent} / 0.12)`,
                    border: `1px solid oklch(${stat.accent} / 0.25)`,
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: `oklch(${stat.accent})` }}
                  />
                </div>
                <p className="font-display text-2xl font-bold text-[oklch(var(--foreground))]">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs font-medium text-[oklch(var(--foreground)/0.7)]">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">
                  {stat.sub}
                </p>
              </div>
            )

            return stat.href ? (
              <Link key={stat.label} href={stat.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={stat.label}>{inner}</div>
            )
          })}
        </div>
      )}

      {/* ── Main two-column grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">

        {/* Recent submissions feed — left column */}
        <RecentSubmissionsFeed
          submissions={submissions ?? []}
          isLoading={submissionsLoading}
        />

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Quick actions */}
          <div className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[oklch(var(--muted-foreground))]" />
              <h2 className="font-display text-base font-semibold text-[oklch(var(--foreground))]">
                Quick Actions
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-lg border border-[oklch(var(--border)/0.5)] px-3 py-2.5 transition-all hover:border-[oklch(var(--spark)/0.3)] hover:bg-[oklch(var(--spark)/0.04)]"
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors"
                      style={{
                        background: `oklch(${action.accent} / 0.1)`,
                        border: `1px solid oklch(${action.accent} / 0.2)`,
                      }}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: `oklch(${action.accent})` }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[oklch(var(--foreground))]">
                        {action.label}
                      </p>
                      <p className="text-[10px] text-[oklch(var(--muted-foreground))]">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[oklch(var(--muted-foreground))] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Course health summary */}
          {!analyticsLoading && analytics && (
            <div className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5">
              <h2 className="font-display mb-4 text-base font-semibold text-[oklch(var(--foreground))]">
                Teaching Overview
              </h2>
              <div className="space-y-3">
                {/* Grading progress */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-[oklch(var(--muted-foreground))]">
                      Grading Progress
                    </span>
                    <span className="text-xs font-semibold text-[oklch(var(--foreground))]">
                      {analytics.gradedThisWeek} this week
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(var(--border))]">
                    <div
                      className="h-full rounded-full bg-[oklch(var(--spark))] transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          analytics.pendingSubmissions > 0
                            ? Math.round(
                                (analytics.gradedThisWeek /
                                  (analytics.gradedThisWeek +
                                    analytics.pendingSubmissions)) *
                                  100
                              )
                            : 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* At-risk ratio */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-[oklch(var(--muted-foreground))]">
                      Student Health
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        atRiskCount > 0
                          ? 'text-red-400'
                          : 'text-[oklch(var(--spark))]'
                      }`}
                    >
                      {atRiskCount > 0
                        ? `${atRiskCount} at risk`
                        : 'All on track'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(var(--border))]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        atRiskCount > 0
                          ? 'bg-red-400'
                          : 'bg-[oklch(var(--spark))]'
                      }`}
                      style={{
                        width: `${Math.max(5, 100 - atRiskPct)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Average grade */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-[oklch(var(--muted-foreground))]">
                      Cohort Average
                    </span>
                    <span className="text-xs font-semibold text-[oklch(var(--foreground))]">
                      {analytics.averageGrade.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(var(--border))]">
                    <div
                      className="h-full rounded-full bg-[oklch(var(--ocean-300))] transition-all duration-500"
                      style={{ width: `${analytics.averageGrade}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}