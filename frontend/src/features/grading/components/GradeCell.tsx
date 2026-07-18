// src/features/grading/components/GradeCell.tsx
'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { getGradeColour } from '../types/gradebook.types'
import type { GradeEntry } from '../types/gradebook.types'

const STATUS_DISPLAY: Record<GradeEntry['status'], string> = {
  graded:  '',
  pending: '—',
  missing: '✗',
  late:    '!',
}

const STATUS_STYLE: Record<GradeEntry['status'], string> = {
  graded:  '',
  pending: 'text-[oklch(var(--muted-foreground)/0.4)]',
  missing: 'text-red-400/50',
  late:    'text-amber-400/70',
}

interface Props {
  entry:        GradeEntry
  courseId:     string
  onSave:       (grade: number) => void
  isSaving:     boolean
  onMoveRight:  () => void
  onMoveLeft:   () => void
  onMoveDown:   () => void
  onMoveUp:     () => void
}

export function GradeCell({ entry, onSave, isSaving, onMoveRight, onMoveLeft, onMoveDown, onMoveUp }: Props) {
  const [editing, setEditing] = useState(false)
  const [value,   setValue]   = useState('')
  const [error,   setError]   = useState(false)
  const inputRef              = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const startEdit = () => {
    if (isSaving) return
    setValue(entry.grade !== null ? String(entry.grade) : '')
    setError(false)
    setEditing(true)
  }

  const commitEdit = () => {
    const num = Number(value)
    if (value.trim() === '') { setEditing(false); return }
    if (isNaN(num) || num < 0 || num > 100) { setError(true); return }
    setEditing(false)
    setError(false)
    onSave(num)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter')      { e.preventDefault(); commitEdit(); onMoveDown()  }
    if (e.key === 'Tab')        { e.preventDefault(); commitEdit(); e.shiftKey ? onMoveLeft() : onMoveRight() }
    if (e.key === 'Escape')     { setEditing(false); setError(false) }
    if (e.key === 'ArrowDown')  { e.preventDefault(); commitEdit(); onMoveDown()  }
    if (e.key === 'ArrowUp')    { e.preventDefault(); commitEdit(); onMoveUp()    }
    if (e.key === 'ArrowRight') { e.preventDefault(); commitEdit(); onMoveRight() }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); commitEdit(); onMoveLeft()  }
  }

  const handleCellKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); startEdit() }
    if (e.key === 'ArrowDown')  { e.preventDefault(); onMoveDown()  }
    if (e.key === 'ArrowUp')    { e.preventDefault(); onMoveUp()    }
    if (e.key === 'ArrowRight') { e.preventDefault(); onMoveRight() }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); onMoveLeft()  }
    if (/^\d$/.test(e.key))     { setValue(e.key); setEditing(true) }
  }

  if (editing) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <input
          ref={inputRef}
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false) }}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          className={`h-full w-full bg-[oklch(var(--background))] text-center text-xs font-semibold outline-none ring-2 ring-inset ${
            error
              ? 'ring-red-500/60 text-red-400'
              : 'ring-[oklch(var(--spark)/0.5)] text-[oklch(var(--foreground))]'
          }`}
          aria-label="Enter grade 0-100"
        />
      </div>
    )
  }

  const displayValue = entry.grade !== null ? String(entry.grade) : STATUS_DISPLAY[entry.status]
  const colourClass  = entry.grade !== null ? getGradeColour(entry.grade) : STATUS_STYLE[entry.status]

  return (
    <div
      role="gridcell"
      tabIndex={0}
      onClick={startEdit}
      onKeyDown={handleCellKeyDown}
      className={`flex h-full w-full cursor-pointer items-center justify-center text-xs font-semibold transition-colors hover:bg-[oklch(var(--spark)/0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[oklch(var(--spark)/0.4)] ${colourClass} ${isSaving ? 'opacity-50' : ''}`}
      aria-label={entry.grade !== null ? `${entry.grade}% — click to edit` : 'No grade — click to add'}
    >
      {isSaving ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[oklch(var(--spark)/0.3)] border-t-[oklch(var(--spark))]" />
      ) : (
        displayValue
      )}
    </div>
  )
}