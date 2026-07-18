// src/features/at-risk/components/InterventionForm.tsx
'use client'

import { useState } from 'react'
import { useLogIntervention } from '../hooks/useLogIntervention'
import { INTERVENTION_CONFIG } from '../types/at-risk.types'
import type { InterventionType } from '../types/at-risk.types'

const INTERVENTION_TYPES: InterventionType[] = [
  'email',
  'meeting',
  'note',
  'referral',
  'extension_granted',
]

interface Props {
  studentId: string
  onSuccess?: () => void
}

export function InterventionForm({ studentId, onSuccess }: Props) {
  const [type, setType]       = useState<InterventionType>('note')
  const [note, setNote]       = useState('')
  const [noteError, setNoteError] = useState('')

  const { mutate: logIntervention, isPending } = useLogIntervention({
    onSuccess: () => {
      setNote('')
      setNoteError('')
      onSuccess?.()
    },
  })

  const handleSubmit = () => {
    if (!note.trim()) {
      setNoteError('Please add a note describing the intervention.')
      return
    }
    setNoteError('')
    logIntervention({ studentId, type, note: note.trim() })
  }

  return (
    <div className="space-y-3">
      {/* Intervention type selector */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[oklch(var(--foreground)/0.8)]">
          Intervention type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {INTERVENTION_TYPES.map((t) => {
            const config  = INTERVENTION_CONFIG[t]
            const active  = type === t
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${
                  active
                    ? `${config.bgClass} ${config.textClass} border-current`
                    : 'border-[oklch(var(--border))] text-[oklch(var(--muted-foreground))] hover:border-[oklch(var(--spark)/0.3)] hover:text-[oklch(var(--foreground))]'
                }`}
              >
                <span aria-hidden>{config.icon}</span>
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Note textarea */}
      <div>
        <label
          htmlFor="intervention-note"
          className="mb-1.5 block text-xs font-medium text-[oklch(var(--foreground)/0.8)]"
        >
          Note
        </label>
        <textarea
          id="intervention-note"
          value={note}
          onChange={(e) => { setNote(e.target.value); setNoteError('') }}
          placeholder="Describe the action taken or planned..."
          rows={3}
          className={`w-full resize-none rounded-lg border bg-[oklch(var(--background))] px-3 py-2.5 text-sm text-[oklch(var(--foreground))] placeholder:text-[oklch(var(--muted-foreground))] outline-none transition-colors focus:ring-1 ${
            noteError
              ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20'
              : 'border-[oklch(var(--border))] focus:border-[oklch(var(--spark)/0.5)] focus:ring-[oklch(var(--spark)/0.2)]'
          }`}
        />
        {noteError && (
          <p className="mt-1 text-xs text-red-400">{noteError}</p>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[oklch(var(--spark)/0.3)] bg-[oklch(var(--spark)/0.1)] px-4 py-2 text-sm font-medium text-[oklch(var(--spark))] transition-colors hover:bg-[oklch(var(--spark)/0.18)] disabled:opacity-50"
      >
        {isPending ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[oklch(var(--spark)/0.3)] border-t-[oklch(var(--spark))]" />
            Logging...
          </>
        ) : (
          'Log Intervention'
        )}
      </button>
    </div>
  )
}