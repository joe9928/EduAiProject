// src/features/grading/components/GradeGrid.tsx
'use client'

import { useState, useCallback, useMemo } from 'react'
import { GradeCell } from './GradeCell'
import { GradeSummaryRow } from './GradeSummaryRow'
import { useUpdateGrade } from '../hooks/useUpdateGrade'
import { getLetterGrade, getGradeColour } from '../types/gradebook.types'
import type { GradeBook, GradeBookStudent, StudentGradeSummary } from '../types/gradebook.types'

const ROW_H     = 48
const COL_W     = 110
const STUDENT_W = 200
const SUMMARY_W = 120
const HEADER_H  = 56

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function GradeGridSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))]">
      <div className="flex border-b border-[oklch(var(--border))]" style={{ height: HEADER_H }}>
        <div style={{ width: STUDENT_W }} className="shrink-0 border-r border-[oklch(var(--border))] p-4">
          <div className="h-4 w-20 animate-pulse rounded bg-[oklch(var(--border))]" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ width: COL_W }} className="shrink-0 border-r border-[oklch(var(--border)/0.5)] p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-[oklch(var(--border))]" />
            <div className="mt-1.5 h-2.5 w-10 animate-pulse rounded bg-[oklch(var(--border))]" />
          </div>
        ))}
        <div style={{ width: SUMMARY_W }} className="shrink-0 border-l border-[oklch(var(--border))] p-4">
          <div className="h-4 w-16 animate-pulse rounded bg-[oklch(var(--border))]" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex border-b border-[oklch(var(--border)/0.5)] last:border-0" style={{ height: ROW_H }}>
          <div style={{ width: STUDENT_W }} className="shrink-0 border-r border-[oklch(var(--border))] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 animate-pulse rounded-full bg-[oklch(var(--border))]" />
              <div className="h-3.5 w-24 animate-pulse rounded bg-[oklch(var(--border))]" />
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} style={{ width: COL_W }} className="shrink-0 flex items-center justify-center border-r border-[oklch(var(--border)/0.4)]">
              <div className="h-4 w-8 animate-pulse rounded bg-[oklch(var(--border))]" />
            </div>
          ))}
          <div style={{ width: SUMMARY_W }} className="shrink-0 flex items-center justify-center border-l border-[oklch(var(--border))]">
            <div className="h-4 w-12 animate-pulse rounded bg-[oklch(var(--border))]" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function computeSummary(student: GradeBookStudent, gradeBook: GradeBook): StudentGradeSummary {
  const studentEntries = gradeBook.entries.filter((e) => e.studentId === student.id)
  const gradedEntries  = studentEntries.filter((e) => e.grade !== null)
  const missingCount   = studentEntries.filter((e) => e.status === 'missing').length

  if (gradedEntries.length === 0) {
    return { studentId: student.id, weightedAverage: null, letterGrade: null, gradeCount: 0, totalAssignments: gradeBook.assignments.length, missingCount }
  }

  const totalWeight  = gradeBook.assignments.reduce((s, a) => s + a.weight, 0)
  const gradedWeight = gradedEntries.reduce((sum, entry) => {
    const a = gradeBook.assignments.find((a) => a.id === entry.assignmentId)
    return sum + (a?.weight ?? 0)
  }, 0)
  const weightedSum  = gradedEntries.reduce((sum, entry) => {
    const a = gradeBook.assignments.find((a) => a.id === entry.assignmentId)
    if (!a) return sum
    return sum + (entry.grade as number) * (a.weight / totalWeight)
  }, 0)

  const avg = gradedWeight > 0 ? (weightedSum / (gradedWeight / totalWeight)) : 0

  return {
    studentId:        student.id,
    weightedAverage:  Math.round(avg * 10) / 10,
    letterGrade:      getLetterGrade(avg),
    gradeCount:       gradedEntries.length,
    totalAssignments: gradeBook.assignments.length,
    missingCount,
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  gradeBook:        GradeBook
  filteredStudents: GradeBookStudent[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GradeGrid({ gradeBook, filteredStudents }: Props) {
  const { mutate: saveGrade, isPending, variables } = useUpdateGrade()
  const [focused, setFocused] = useState<[number, number] | null>(null)

  const assignments = gradeBook.assignments
  const students    = filteredStudents

  const summaries = useMemo(
    () => students.map((s) => computeSummary(s, gradeBook)),
    [students, gradeBook]
  )

  const getEntry = useCallback(
    (studentId: string, assignmentId: string) =>
      gradeBook.entries.find((e) => e.studentId === studentId && e.assignmentId === assignmentId) ?? {
        studentId, assignmentId, grade: null, submissionId: null, status: 'missing' as const,
      },
    [gradeBook.entries]
  )

  const isCellSaving = (studentId: string, assignmentId: string) =>
    isPending && variables?.studentId === studentId && variables?.assignmentId === assignmentId

  const colAverages = useMemo(
    () => assignments.map((a) => {
      const grades = students.map((s) => getEntry(s.id, a.id)).filter((e) => e.grade !== null).map((e) => e.grade as number)
      return grades.length > 0 ? grades.reduce((s, g) => s + g, 0) / grades.length : null
    }),
    [assignments, students, getEntry]
  )

  const move = (dr: number, dc: number) => {
    setFocused((prev) => {
      if (!prev) return [0, 0]
      const [r, c] = prev
      return [
        Math.max(0, Math.min(students.length    - 1, r + dr)),
        Math.max(0, Math.min(assignments.length - 1, c + dc)),
      ]
    })
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] py-16 text-center">
        <p className="text-sm font-medium text-[oklch(var(--foreground)/0.6)]">No students match your search</p>
      </div>
    )
  }

  return (
    <div className="overflow-auto rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))]">
      <div style={{ minWidth: STUDENT_W + assignments.length * COL_W + SUMMARY_W }}>

        {/* Header */}
        <div className="sticky top-0 z-20 flex border-b border-[oklch(var(--border))] bg-[oklch(var(--card))]" style={{ height: HEADER_H }}>
          <div className="sticky left-0 z-30 flex shrink-0 items-center border-r border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4" style={{ width: STUDENT_W }}>
            <span className="text-xs font-semibold text-[oklch(var(--muted-foreground))]">Student ({students.length})</span>
          </div>
          {assignments.map((assignment, ci) => (
            <div key={assignment.id} className="flex shrink-0 flex-col justify-center border-r border-[oklch(var(--border)/0.5)] px-3" style={{ width: COL_W }}>
              <p className="truncate text-xs font-medium text-[oklch(var(--foreground)/0.8)]">{assignment.title}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[10px] text-[oklch(var(--muted-foreground)/0.6)]">{assignment.weight}%</span>
                {colAverages[ci] !== null && (
                  <span className={`text-[10px] font-semibold ${getGradeColour(colAverages[ci])}`}>
                    avg {colAverages[ci]!.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="sticky right-0 z-30 flex shrink-0 items-center border-l border-[oklch(var(--border))] bg-[oklch(var(--card))] px-3" style={{ width: SUMMARY_W }}>
            <span className="text-xs font-semibold text-[oklch(var(--muted-foreground))]">Final Grade</span>
          </div>
        </div>

        {/* Student rows */}
        {students.map((student, ri) => (
          <div key={student.id} className="flex border-b border-[oklch(var(--border)/0.5)] last:border-0" style={{ height: ROW_H }}>
            <div className="sticky left-0 z-10 flex shrink-0 items-center gap-2.5 border-r border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4" style={{ width: STUDENT_W }}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[oklch(var(--spark)/0.1)] text-[10px] font-semibold text-[oklch(var(--spark))]">
                {getInitials(student.name)}
              </div>
              <span className="truncate text-xs font-medium text-[oklch(var(--foreground))]">{student.name}</span>
            </div>

            {assignments.map((assignment, ci) => {
              const entry     = getEntry(student.id, assignment.id)
              const isFocused = focused?.[0] === ri && focused?.[1] === ci
              return (
                <div
                  key={assignment.id}
                  className={`shrink-0 border-r border-[oklch(var(--border)/0.4)] ${isFocused ? 'ring-2 ring-inset ring-[oklch(var(--spark)/0.4)]' : ''}`}
                  style={{ width: COL_W, height: ROW_H }}
                  onClick={() => setFocused([ri, ci])}
                >
                  <GradeCell
                    entry={entry}
                    courseId={gradeBook.courseId}
                    isSaving={isCellSaving(student.id, assignment.id)}
                    onSave={(grade) => saveGrade({ studentId: student.id, assignmentId: assignment.id, grade, courseId: gradeBook.courseId })}
                    onMoveRight={() => move(0,  1)}
                    onMoveLeft={() =>  move(0, -1)}
                    onMoveDown={() =>  move(1,  0)}
                    onMoveUp={() =>    move(-1, 0)}
                  />
                </div>
              )
            })}

            <div className="sticky right-0 z-10 shrink-0 border-l border-[oklch(var(--border))] bg-[oklch(var(--card))]" style={{ width: SUMMARY_W, height: ROW_H }}>
              <GradeSummaryRow summary={summaries[ri]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}