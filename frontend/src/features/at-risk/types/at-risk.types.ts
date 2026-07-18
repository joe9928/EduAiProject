// src/features/at-risk/types/at-risk.types.ts

// ─── Risk levels ──────────────────────────────────────────────────────────────

export type RiskLevel = 'high' | 'medium' | 'low'

export type RiskLevelFilter = 'all' | RiskLevel

// ─── Contributing factors ─────────────────────────────────────────────────────
// Each factor explains WHY a student is flagged — never show a score alone.

export type RiskFactorType =
  | 'missed_assignments'
  | 'low_quiz_scores'
  | 'declining_grades'
  | 'low_engagement'
  | 'missed_deadlines'
  | 'attendance_drop'
  | 'late_submissions'
  | 'no_recent_activity'

export interface RiskFactor {
  type: RiskFactorType
  label: string             // e.g. "Missed 4 assignments"
  detail: string            // e.g. "3 of the last 4 assignments were not submitted"
  severity: RiskLevel       // drives the colour of this factor pill
}

// ─── Intervention ─────────────────────────────────────────────────────────────

export type InterventionType =
  | 'email'
  | 'meeting'
  | 'note'
  | 'referral'
  | 'extension_granted'

export interface Intervention {
  id: string
  type: InterventionType
  note: string
  createdAt: string         // ISO string
  createdBy: string         // lecturer name
}

// ─── At-risk student ──────────────────────────────────────────────────────────

export interface AtRiskStudent {
  id: string
  name: string
  avatar: string | null
  email: string
  courseTitle: string
  courseId: string
  riskLevel: RiskLevel
  riskFactors: RiskFactor[]
  interventions: Intervention[]
  lastActive: string        // ISO string
  overallGrade: number | null
  assignmentCompletion: number  // 0–100 percentage
  engagementScore: number       // 0–100 percentage
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface AtRiskFilters {
  riskLevel: RiskLevelFilter
  courseId: string
  search: string
}

// ─── Mutation payload ─────────────────────────────────────────────────────────

export interface LogInterventionPayload {
  studentId: string
  type: InterventionType
  note: string
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const atRiskQueryKeys = {
  all:    ['at-risk'] as const,
  list:   (filters?: Partial<AtRiskFilters>) => ['at-risk', 'list', filters ?? {}] as const,
  detail: (id: string) => ['at-risk', id] as const,
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; dotClass: string; textClass: string; bgClass: string; borderClass: string }
> = {
  high: {
    label:       'High Risk',
    dotClass:    'bg-red-400',
    textClass:   'text-red-400',
    bgClass:     'bg-red-500/10',
    borderClass: 'border-red-500/20',
  },
  medium: {
    label:       'Medium Risk',
    dotClass:    'bg-amber-400',
    textClass:   'text-amber-400',
    bgClass:     'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
  },
  low: {
    label:       'Low Risk',
    dotClass:    'bg-[oklch(var(--ocean-300)/0.8)]',
    textClass:   'text-[oklch(var(--ocean-300))]',
    bgClass:     'bg-[oklch(var(--ocean-300)/0.08)]',
    borderClass: 'border-[oklch(var(--ocean-300)/0.2)]',
  },
}

export const FACTOR_ICONS: Record<RiskFactorType, string> = {
  missed_assignments:  '📋',
  low_quiz_scores:     '📊',
  declining_grades:    '📉',
  low_engagement:      '👁️',
  missed_deadlines:    '⏰',
  attendance_drop:     '🚫',
  late_submissions:    '🕐',
  no_recent_activity:  '💤',
}

export const INTERVENTION_CONFIG: Record<
  InterventionType,
  { label: string; icon: string; bgClass: string; textClass: string }
> = {
  email:             { label: 'Email sent',        icon: '✉️',  bgClass: 'bg-[oklch(var(--spark)/0.08)]',     textClass: 'text-[oklch(var(--spark))]'     },
  meeting:           { label: 'Meeting held',      icon: '🤝',  bgClass: 'bg-[oklch(var(--ocean-300)/0.08)]', textClass: 'text-[oklch(var(--ocean-300))]'  },
  note:              { label: 'Note logged',       icon: '📝',  bgClass: 'bg-[oklch(var(--border)/0.5)]',     textClass: 'text-[oklch(var(--muted-foreground))]' },
  referral:          { label: 'Referred for support', icon: '🔗', bgClass: 'bg-amber-500/10',                textClass: 'text-amber-400'                  },
  extension_granted: { label: 'Extension granted', icon: '📅',  bgClass: 'bg-[oklch(var(--spark)/0.08)]',    textClass: 'text-[oklch(var(--spark))]'     },
}