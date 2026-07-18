// src/features/at-risk/lecturer/LecturerAtRiskView.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useAtRiskStudents } from '../hooks/useAtRiskStudents'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { AtRiskStatsBar } from '../components/AtRiskStatsBar'
import { RiskStudentTable } from '../components/RiskStudentTable'
import { RiskStudentDetail } from '../components/RiskStudentDetail'
import { RISK_CONFIG } from '../types/at-risk.types'
import type { AtRiskFilters, AtRiskStudent, RiskLevelFilter } from '../types/at-risk.types'

const DEFAULT_FILTERS: AtRiskFilters = {
  riskLevel: 'all',
  courseId:  '',
  search:    '',
}

const RISK_TABS: { value: RiskLevelFilter; label: string }[] = [
  { value: 'all',    label: 'All' },
  { value: 'high',   label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low' },
]

export function LecturerAtRiskView() {
  const [filters, setFilters]           = useState<AtRiskFilters>(DEFAULT_FILTERS)
  const [selectedStudent, setSelected]  = useState<AtRiskStudent | null>(null)

  const { data: allStudents = [], isLoading } = useAtRiskStudents()
  const { data: courses     = [] }            = useCourses()

  const set = (partial: Partial<AtRiskFilters>) =>
    setFilters((prev) => ({ ...prev, ...partial }))

  // Close detail on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Client-side filter
  const filteredStudents = useMemo(() => {
    let result = [...allStudents]

    if (filters.riskLevel !== 'all') {
      result = result.filter((s) => s.riskLevel === filters.riskLevel)
    }
    if (filters.courseId) {
      result = result.filter((s) => s.courseId === filters.courseId)
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      )
    }

    return result
  }, [allStudents, filters])

  const isFiltered =
    filters.riskLevel !== 'all' ||
    filters.courseId  !== '' ||
    filters.search    !== ''

  const drawerOpen = selectedStudent !== null

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[oklch(var(--foreground))] md:text-3xl">
          At-Risk Students
        </h1>
        <p className="mt-1 text-sm text-[oklch(var(--muted-foreground))]">
          Identify students who need early intervention before they fall behind.
        </p>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <AtRiskStatsBar students={allStudents} isLoading={isLoading} />

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Row 1: search + course */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[oklch(var(--muted-foreground))]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Search students..."
              className="h-9 w-full rounded-lg border border-[oklch(var(--border))] bg-[oklch(var(--background))] pl-9 pr-9 text-sm text-[oklch(var(--foreground))] placeholder:text-[oklch(var(--muted-foreground))] outline-none transition-colors focus:border-[oklch(var(--spark)/0.5)] focus:ring-1 focus:ring-[oklch(var(--spark)/0.2)]"
            />
            {filters.search && (
              <button
                onClick={() => set({ search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[oklch(var(--muted-foreground))] hover:text-[oklch(var(--foreground))]"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select
            value={filters.courseId}
            onChange={(e) => set({ courseId: e.target.value })}
            className="h-9 rounded-lg border border-[oklch(var(--border))] bg-[oklch(var(--background))] px-3 text-sm text-[oklch(var(--foreground))] outline-none transition-colors focus:border-[oklch(var(--spark)/0.5)] cursor-pointer"
            aria-label="Filter by course"
          >
            <option value="">All courses</option>
            {courses
              .filter((c) => c.status === 'published')
              .map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
          </select>
        </div>

        {/* Row 2: risk level tabs */}
        <div className="flex items-center gap-1" role="tablist" aria-label="Filter by risk level">
          {RISK_TABS.map((tab) => {
            const active = filters.riskLevel === tab.value
            const config = tab.value !== 'all' ? RISK_CONFIG[tab.value] : null
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={active}
                onClick={() => set({ riskLevel: tab.value })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active && config
                    ? `${config.bgClass} ${config.textClass} border ${config.borderClass}`
                    : active
                    ? 'bg-[oklch(var(--spark)/0.12)] text-[oklch(var(--spark))]'
                    : 'text-[oklch(var(--muted-foreground))] hover:bg-[oklch(var(--foreground)/0.05)] hover:text-[oklch(var(--foreground))]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Result count ──────────────────────────────────────────────────────── */}
      {!isLoading && (
        <p className="text-xs text-[oklch(var(--muted-foreground))]">
          {filteredStudents.length === allStudents.length
            ? `${allStudents.length} student${allStudents.length !== 1 ? 's' : ''} flagged`
            : `${filteredStudents.length} of ${allStudents.length} students`}
        </p>
      )}

      {/* ── Master-detail layout ──────────────────────────────────────────────── */}
      <div
        className={`overflow-hidden rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] transition-all duration-300 ${
          drawerOpen
            ? 'grid grid-cols-1 lg:grid-cols-[1fr_400px]'
            : 'block'
        }`}
      >
        {/* Master list */}
        <div
          className={`overflow-y-auto ${
            drawerOpen
              ? 'max-h-[calc(100vh-280px)] border-r border-[oklch(var(--border))]'
              : ''
          }`}
        >
          <RiskStudentTable
            students={filteredStudents}
            selectedId={selectedStudent?.id ?? null}
            isLoading={isLoading}
            isFiltered={isFiltered}
            onSelect={setSelected}
          />
        </div>

        {/* Detail panel */}
        {drawerOpen && (
          <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
            <RiskStudentDetail
              student={selectedStudent}
              onClose={() => setSelected(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}