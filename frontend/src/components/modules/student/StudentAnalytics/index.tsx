// src/components/modules/student/StudentAnalyticsModule/index.tsx
'use client'

import {
  Area, AreaChart, Bar, BarChart, RadialBar,
  RadialBarChart, Line, LineChart,
  XAxis, YAxis, CartesianGrid,
  PolarAngleAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription,
} from '@/components/ui/card'
import { Skeleton }          from '@/components/ui/skeleton'
import { TrendingUp, Target, Activity, BarChart3 } from 'lucide-react'
import { useStudentAnalytics }  from '@/hooks/useStudent'
import { formatDistanceToNow }  from 'date-fns'

// ── Chart configs — binds data keys to our brand colors ──────
const progressChartConfig = {
  completion: {
    label: 'Completion %',
    color: 'oklch(var(--spark))',
  },
  score: {
    label: 'Avg Score %',
    color: 'oklch(var(--ocean-300))',
  },
} satisfies ChartConfig

const radialConfig = {
  progress: {
    label: 'Overall Progress',
    color: 'oklch(var(--spark))',
  },
} satisfies ChartConfig

const activityConfig = {
  events: {
    label: 'Activity Events',
    color: 'oklch(var(--spark))',
  },
} satisfies ChartConfig

const scoreConfig = {
  score: {
    label: 'Avg Score',
    color: 'oklch(var(--spark))',
  },
} satisfies ChartConfig

// ── Loading skeleton ─────────────────────────────────────────
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-3 w-56 mb-6" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function StudentAnalyticsModule() {
  const { data: analytics, isLoading } = useStudentAnalytics()

  if (isLoading) return <AnalyticsSkeleton />
  if (!analytics) return null

  const { courseProgress, recentActivity, overallProgress } = analytics

  // ── Derived datasets ─────────────────────────────────────
  // Bar chart — course completion vs score per course
  const courseBarData = courseProgress.map((c) => ({
    name:       c.title.length > 18 ? c.title.slice(0, 18) + '…' : c.title,
    fullTitle:  c.title,
    completion: c.completionPct,
    score:      c.avgScore,
  }))

  // Radial chart — single overall progress ring
  const radialData = [
    { name: 'Progress', progress: overallProgress, fill: 'var(--color-progress)' },
  ]

  // Activity line chart — group events by day (last 7 days)
  const activityByDay = (() => {
    const map: Record<string, number> = {}
    const days = 7
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-US', { weekday: 'short' })
      map[key] = 0
    }
    recentActivity.forEach((event) => {
      const d   = new Date(event.occurredAt)
      const key = d.toLocaleDateString('en-US', { weekday: 'short' })
      if (key in map) map[key]++
    })
    return Object.entries(map).map(([day, events]) => ({ day, events }))
  })()

  // Summary stat cards
  const totalLessons    = courseProgress.reduce((s, c) => s + c.totalLessons, 0)
  const completedLessons = courseProgress.reduce((s, c) => s + c.completedLessons, 0)
  const avgScore        = courseProgress.length > 0
    ? Math.round(courseProgress.reduce((s, c) => s + c.avgScore, 0) / courseProgress.length)
    : 0
  const completedCourses = courseProgress.filter((c) => c.completionPct === 100).length

  const STATS = [
    {
      icon:   TrendingUp,
      label:  'Overall Progress',
      value:  `${overallProgress}%`,
      sub:    `${completedCourses} of ${courseProgress.length} courses complete`,
      accent: 'var(--spark)',
    },
    {
      icon:   Target,
      label:  'Average Score',
      value:  `${avgScore}%`,
      sub:    'across all assessments',
      accent: 'var(--ocean-300)',
    },
    {
      icon:   BarChart3,
      label:  'Lessons Completed',
      value:  completedLessons.toString(),
      sub:    `of ${totalLessons} total lessons`,
      accent: 'var(--spark)',
    },
    {
      icon:   Activity,
      label:  'Recent Events',
      value:  recentActivity.length.toString(),
      sub:    'learning activities logged',
      accent: 'var(--ocean-300)',
    },
  ]

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[oklch(var(--foreground))]">
          My Analytics
        </h1>
        <p className="mt-1 text-sm text-[oklch(var(--muted-foreground))]">
          Your learning performance at a glance
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="border-[oklch(var(--border))] bg-[oklch(var(--card))] transition-colors hover:border-[oklch(var(--spark)/0.3)]"
            >
              <CardContent className="p-4">
                <div
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    background: `oklch(${stat.accent} / 0.12)`,
                    border:     `1px solid oklch(${stat.accent} / 0.25)`,
                  }}
                >
                  <Icon className="h-4 w-4" style={{ color: `oklch(${stat.accent})` }} />
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
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* 1 — Course progress vs score (grouped bar chart) */}
        <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base text-[oklch(var(--foreground))]">
              Course Performance
            </CardTitle>
            <CardDescription className="text-xs text-[oklch(var(--muted-foreground))]">
              Completion % vs average score per course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courseBarData.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-[oklch(var(--muted-foreground))]">
                No course data yet
              </div>
            ) : (
              <ChartContainer
                config={progressChartConfig}
                className="h-48 w-full"
              >
                <BarChart
                  data={courseBarData}
                  margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="oklch(var(--border))"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item) => (
                          <span className="text-xs">
                            {item.payload.fullTitle}: {value}%
                          </span>
                        )}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="completion"
                    fill="var(--color-completion)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="score"
                    fill="var(--color-score)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* 2 — Overall progress radial */}
        <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base text-[oklch(var(--foreground))]">
              Overall Progress
            </CardTitle>
            <CardDescription className="text-xs text-[oklch(var(--muted-foreground))]">
              Your platform-wide completion rate
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative">
              <ChartContainer
                config={radialConfig}
                className="h-48 w-48"
              >
                <RadialBarChart
                  data={radialData}
                  startAngle={90}
                  endAngle={90 - (overallProgress / 100) * 360}
                  innerRadius={60}
                  outerRadius={80}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <RadialBar
                    dataKey="progress"
                    cornerRadius={8}
                    background={{ fill: 'oklch(var(--border))' }}
                  />
                </RadialBarChart>
              </ChartContainer>

              {/* Centre label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold text-[oklch(var(--foreground))]">
                  {overallProgress}%
                </span>
                <span className="text-xs text-[oklch(var(--muted-foreground))]">
                  complete
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3 — Weekly activity line chart */}
        <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base text-[oklch(var(--foreground))]">
              Weekly Activity
            </CardTitle>
            <CardDescription className="text-xs text-[oklch(var(--muted-foreground))]">
              Learning events over the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activityConfig} className="h-48 w-full">
              <LineChart
                data={activityByDay}
                margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="oklch(var(--border))"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="events"
                  stroke="var(--color-events)"
                  strokeWidth={2}
                  dot={{
                    fill:        'var(--color-events)',
                    strokeWidth: 0,
                    r:           4,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 4 — Per-course avg score area chart */}
        <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base text-[oklch(var(--foreground))]">
              Score Trend
            </CardTitle>
            <CardDescription className="text-xs text-[oklch(var(--muted-foreground))]">
              Average quiz/assignment score per course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courseBarData.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-[oklch(var(--muted-foreground))]">
                Complete assessments to see score trends
              </div>
            ) : (
              <ChartContainer config={scoreConfig} className="h-48 w-full">
                <AreaChart
                  data={courseBarData}
                  margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="oklch(var(--spark))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(var(--spark))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="oklch(var(--border))"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="score"
                    stroke="var(--color-score)"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                    dot={{ fill: 'var(--color-score)', r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity feed */}
      {recentActivity.length > 0 && (
        <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-[oklch(var(--foreground))]">
              Activity Feed
            </CardTitle>
            <CardDescription className="text-xs text-[oklch(var(--muted-foreground))]">
              Your recent learning events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-[oklch(var(--border)/0.5)]">
              {recentActivity.slice(0, 8).map((event) => (
                <div key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(var(--spark)/0.6)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[oklch(var(--foreground)/0.85)]">
                      {event.description}
                    </p>
                    {event.courseName && (
                      <p className="text-xs text-[oklch(var(--muted-foreground))]">
                        {event.courseName}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-[oklch(var(--muted-foreground)/0.6)]">
                    {formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}