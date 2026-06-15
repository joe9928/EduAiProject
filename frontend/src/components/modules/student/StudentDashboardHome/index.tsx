// src/components/modules/student/StudentDashboardHome/index.tsx
'use client'

import {
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  ArrowRight,
  CalendarClock,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow, format, isPast } from 'date-fns'
import { useStudentAnalytics } from '@/hooks/useStudent'
import { useGreeting } from '@/hooks/useDashboard'
import RecommendationsWidget from '@/components/modules/shared/RecommendationsWidget'
import {
  StatsSkeleton,
  ListSkeleton,
  CourseCardSkeleton,
  DeadlineSkeleton,
  ActivityItemSkeleton,
  RecommendationSkeleton,
  DashboardHomeSkeleton,
} from '@/components/ui/redesigns/Skeletons'

export default function StudentDashboardHome() {
  const { greeting, firstName } = useGreeting()
  const { data: analytics, isLoading } = useStudentAnalytics()

  const stats = analytics
    ? [
        {
          icon: BookOpen,
          label: 'Enrolled Courses',
          value: analytics.courseProgress.length.toString(),
          sub: `${analytics.courseProgress.filter((c) => c.completionPct > 0 && c.completionPct < 100).length} in progress`,
          accent: 'var(--spark)',
        },
        {
          icon: TrendingUp,
          label: 'Overall Progress',
          value: `${analytics.overallProgress}%`,
          sub: 'across all courses',
          accent: 'var(--ocean-300)',
        },
        {
          icon: CheckCircle2,
          label: 'Lessons Done',
          value: analytics.courseProgress
            .reduce((s, c) => s + c.completedLessons, 0)
            .toString(),
          sub: 'total completed',
          accent: 'var(--spark)',
        },
        {
          icon: Clock,
          label: 'Due This Week',
          value: analytics.upcomingDeadlines
            .filter((d) => {
              const diff = new Date(d.dueDate).getTime() - Date.now()
              return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
            })
            .length.toString(),
          sub: 'upcoming deadlines',
          accent: 'var(--ocean-300)',
        },
      ]
    : []

  const urgentDeadlines =
    analytics?.upcomingDeadlines.filter((d) => {
      const diff = new Date(d.dueDate).getTime() - Date.now()
      return diff > 0 && diff < 48 * 60 * 60 * 1000
    }) ?? []

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[oklch(var(--foreground))] md:text-3xl">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-[oklch(var(--muted-foreground))]">
            {urgentDeadlines.length > 0
              ? `${urgentDeadlines.length} deadline${urgentDeadlines.length > 1 ? 's' : ''} coming up in the next 48 hours.`
              : "You're all caught up. Keep the momentum going!"}
          </p>
        </div>
        <span className="hidden rounded-full border border-[oklch(var(--spark)/0.25)] bg-[oklch(var(--spark)/0.08)] px-3 py-1 text-xs font-medium text-[oklch(var(--spark))] sm:block">
          Student
        </span>
      </div>

      {/* Urgent deadline alert */}
      {urgentDeadlines.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-300">
              Deadline Alert
            </p>
            <ul className="mt-1 space-y-0.5">
              {urgentDeadlines.map((d) => (
                <li key={d.id} className="text-xs text-amber-300/80">
                  {d.title} — {d.courseName} —{' '}
                  <span className="font-medium">
                    due{' '}
                    {formatDistanceToNow(new Date(d.dueDate), {
                      addSuffix: true,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
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
          })}
        </div>
      )}

      {/* Main two-column grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Continue learning */}
        <div className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[oklch(var(--foreground))]">
              Continue Learning
            </h2>
            <Link
              href="/dashboard/courses"
              className="flex items-center gap-1 text-xs text-[oklch(var(--spark))] transition-opacity hover:opacity-75"
            >
              All courses <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {isLoading ? (
            <ListSkeleton rows={3} />
          ) : analytics && analytics.courseProgress.length > 0 ? (
            <div className="flex flex-col gap-3">
              {analytics.courseProgress
                .filter((c) => c.completionPct < 100)
                .slice(0, 3)
                .map((course) => (
                  <Link
                    key={course.courseId}
                    href={`/dashboard/courses/${course.courseId}`}
                    className="group flex items-center gap-4 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--background))] p-3.5 transition-all hover:border-[oklch(var(--spark)/0.3)] hover:bg-[oklch(var(--card))]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[oklch(var(--spark)/0.1)] transition-colors group-hover:bg-[oklch(var(--spark)/0.18)]">
                      <PlayCircle className="h-5 w-5 text-[oklch(var(--spark))]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[oklch(var(--foreground))]">
                        {course.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">
                        {course.completedLessons}/{course.totalLessons} lessons
                        {course.avgScore > 0 && ` · avg ${course.avgScore}%`}
                      </p>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[oklch(var(--border))]">
                        <div
                          className="h-full rounded-full bg-[oklch(var(--spark))] transition-all duration-500"
                          style={{ width: `${course.completionPct}%` }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[oklch(var(--spark))]">
                      {course.completionPct}%
                    </span>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="mb-2 h-8 w-8 text-[oklch(var(--muted-foreground)/0.4)]" />
              <p className="text-sm text-[oklch(var(--foreground)/0.6)]">
                No courses in progress
              </p>
              <Link
                href="/dashboard/courses"
                className="mt-2 text-xs text-[oklch(var(--spark))] hover:opacity-75"
              >
                Browse catalogue →
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Upcoming deadlines */}
          <div className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-[oklch(var(--muted-foreground))]" />
              <h2 className="font-display text-base font-semibold text-[oklch(var(--foreground))]">
                Upcoming Deadlines
              </h2>
            </div>

            {isLoading ? (
              <ListSkeleton rows={2} />
            ) : analytics && analytics.upcomingDeadlines.length > 0 ? (
              <div className="flex flex-col gap-2">
                {analytics.upcomingDeadlines.slice(0, 4).map((item) => {
                  const isUrgent = new Date(item.dueDate).getTime() - Date.now()
                  48 * 60 * 60 * 1000
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-[oklch(var(--border)/0.5)] px-3 py-2.5"
                    >
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isUrgent
                            ? 'bg-amber-400'
                            : 'bg-[oklch(var(--spark)/0.6)]'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-[oklch(var(--foreground))]">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[oklch(var(--muted-foreground))]">
                          {item.courseName}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-semibold ${
                          isUrgent
                            ? 'text-amber-400'
                            : 'text-[oklch(var(--muted-foreground))]'
                        }`}
                      >
                        {format(new Date(item.dueDate), 'MMM d')}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-[oklch(var(--muted-foreground))]">
                No upcoming deadlines
              </p>
            )}
          </div>

          {/* Recent activity */}
          <div className="rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[oklch(var(--muted-foreground))]" />
              <h2 className="font-display text-base font-semibold text-[oklch(var(--foreground))]">
                Recent Activity
              </h2>
            </div>

            {isLoading ? (
              <ListSkeleton rows={2} />
            ) : analytics && analytics.recentActivity.length > 0 ? (
              <div className="flex flex-col gap-2">
                {analytics.recentActivity.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 py-1">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(var(--spark)/0.5)]" />
                    <div>
                      <p className="text-xs text-[oklch(var(--foreground)/0.8)]">
                        {event.description}
                      </p>
                      <p className="text-[10px] text-[oklch(var(--muted-foreground))]">
                        {formatDistanceToNow(new Date(event.occurredAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-[oklch(var(--muted-foreground))]">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <RecommendationsWidget />
    </div>
  )
}
