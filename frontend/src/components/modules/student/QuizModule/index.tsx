// src/components/modules/student/QuizModule/index.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  CheckCircle2, XCircle, Clock, ChevronRight,
  ChevronLeft, Trophy, RotateCcw, BookOpen,
  AlertTriangle, Lock, Star,
} from 'lucide-react'
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription,
} from '@/components/ui/card'
import { Skeleton }  from '@/components/ui/skeleton'
import { Progress }  from '@/components/ui/progress'
import {
  useAvailableQuizzes,
  useStartQuiz,
  useSubmitQuiz,
} from '@/hooks/useStudent'
import type { QuizAttempt, QuizResult } from '@/lib/api/student'
import { mockAvailableQuizzes }         from '@/mocks/student'

type Screen = 'list' | 'taking' | 'result'
type AnswerMap = Record<string, string>  // questionId → selectedOption

// ── Utility ───────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── Quiz list screen ──────────────────────────────────────────
function QuizListScreen({
  onStart,
}: {
  onStart: (quizId: string) => void
}) {
  const { data: quizzes = [], isLoading } = useAvailableQuizzes()

  const statusConfig = {
    AVAILABLE:  { label: 'Start',        color: 'bg-[oklch(var(--spark))] text-[oklch(var(--ocean-950))]', disabled: false },
    COMPLETED:  { label: 'Retake',       color: 'bg-[oklch(var(--ocean-700))] text-[oklch(var(--foreground))]', disabled: false },
    LOCKED:     { label: 'Locked',       color: 'bg-[oklch(var(--border))] text-[oklch(var(--muted-foreground))]', disabled: true },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[oklch(var(--foreground))]">
          Quizzes
        </h1>
        <p className="mt-1 text-sm text-[oklch(var(--muted-foreground))]">
          Test your knowledge and track your progress
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg ml-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {quizzes.map((quiz) => {
            const cfg = statusConfig[quiz.status]
            return (
              <Card
                key={quiz.id}
                className={`border-[oklch(var(--border))] bg-[oklch(var(--card))] transition-all ${
                  quiz.status !== 'LOCKED'
                    ? 'hover:border-[oklch(var(--spark)/0.3)] hover:-translate-y-0.5'
                    : 'opacity-60'
                }`}
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {quiz.status === 'LOCKED' && (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-[oklch(var(--muted-foreground))]" />
                        )}
                        {quiz.status === 'COMPLETED' && (
                          <Star className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                        )}
                        <h3 className="font-display text-sm font-semibold text-[oklch(var(--foreground))]">
                          {quiz.title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-xs text-[oklch(var(--muted-foreground))]">
                        {quiz.courseName}
                      </p>
                    </div>
                    {quiz.bestScore !== null && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          quiz.bestScore >= quiz.passingScore
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {quiz.bestScore}%
                      </span>
                    )}
                  </div>

                  {/* Meta pills */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(var(--foreground)/0.05)] px-2 py-1 text-[10px] text-[oklch(var(--muted-foreground))]">
                      <BookOpen className="h-3 w-3" />
                      {quiz.questionCount} questions
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(var(--foreground)/0.05)] px-2 py-1 text-[10px] text-[oklch(var(--muted-foreground))]">
                      <Clock className="h-3 w-3" />
                      {quiz.timeLimitMin} min
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(var(--foreground)/0.05)] px-2 py-1 text-[10px] text-[oklch(var(--muted-foreground))]">
                      <Trophy className="h-3 w-3" />
                      Pass: {quiz.passingScore}%
                    </span>
                    {quiz.attempts > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(var(--foreground)/0.05)] px-2 py-1 text-[10px] text-[oklch(var(--muted-foreground))]">
                        <RotateCcw className="h-3 w-3" />
                        {quiz.attempts} attempt{quiz.attempts > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => !cfg.disabled && onStart(quiz.id)}
                    disabled={cfg.disabled}
                    className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${cfg.color} ${
                      !cfg.disabled
                        ? 'hover:opacity-90 hover:shadow-[0_0_16px_oklch(var(--spark)/0.25)] active:scale-[0.98]'
                        : 'cursor-not-allowed'
                    }`}
                  >
                    {cfg.label}
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Active quiz screen ────────────────────────────────────────
function TakingQuizScreen({
  attempt,
  onSubmit,
  isSubmitting,
}: {
  attempt:     QuizAttempt
  onSubmit:    (answers: AnswerMap) => void
  isSubmitting: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers,      setAnswers]      = useState<AnswerMap>({})
  const [timeLeft,     setTimeLeft]     = useState(
    (attempt.timeLimitMin ?? 15) * 60
  )
  const [showConfirm, setShowConfirm]   = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          onSubmit(answers)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const question  = attempt.questions[currentIndex]
  const total     = attempt.questions.length
  const answered  = Object.keys(answers).length
  const isLast    = currentIndex === total - 1
  const progress  = Math.round((answered / total) * 100)
  const isWarning = timeLeft < 120 // under 2 minutes

  const handleAnswer = useCallback((option: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: option }))
  }, [question.id])

  const handleSubmit = () => {
    clearInterval(timerRef.current!)
    onSubmit(answers)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">

      {/* Top bar */}
      <div className="flex items-center justify-between rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[oklch(var(--foreground))]">
            Question {currentIndex + 1}
            <span className="text-[oklch(var(--muted-foreground))]"> / {total}</span>
          </span>
          <span className="text-xs text-[oklch(var(--muted-foreground))]">
            {answered} answered
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            isWarning
              ? 'bg-red-500/15 text-red-400 animate-pulse'
              : 'bg-[oklch(var(--foreground)/0.06)] text-[oklch(var(--foreground))]'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <Progress
        value={progress}
        className="h-1.5 bg-[oklch(var(--border))]"
      />

      {/* Question card */}
      <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
        <CardHeader className="pb-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-[oklch(var(--spark)/0.1)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(var(--spark))]">
              {question.type === 'MCQ'
                ? 'Multiple Choice'
                : question.type === 'TRUE_FALSE'
                ? 'True / False'
                : 'Short Answer'}
            </span>
            <span className="text-[10px] text-[oklch(var(--muted-foreground))]">
              {question.points} point{question.points > 1 ? 's' : ''}
            </span>
          </div>
          <CardTitle className="font-display text-base leading-snug text-[oklch(var(--foreground))]">
            {question.text}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2.5">
          {question.options?.map((option) => {
            const isSelected = answers[question.id] === option
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'border-[oklch(var(--spark)/0.6)] bg-[oklch(var(--spark)/0.1)] text-[oklch(var(--spark))] shadow-[0_0_12px_oklch(var(--spark)/0.15)]'
                    : 'border-[oklch(var(--border))] bg-[oklch(var(--background))] text-[oklch(var(--foreground)/0.8)] hover:border-[oklch(var(--spark)/0.3)] hover:bg-[oklch(var(--foreground)/0.03)]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                      isSelected
                        ? 'border-[oklch(var(--spark))] bg-[oklch(var(--spark))] text-[oklch(var(--ocean-950))]'
                        : 'border-[oklch(var(--border))] text-[oklch(var(--muted-foreground))]'
                    }`}
                  >
                    {String.fromCharCode(65 + (question.options?.indexOf(option) ?? 0))}
                  </span>
                  {option}
                </span>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 rounded-xl border border-[oklch(var(--border))] px-4 py-2.5 text-sm font-medium text-[oklch(var(--foreground)/0.7)] transition-colors hover:border-[oklch(var(--border)/2)] hover:text-[oklch(var(--foreground))] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {/* Question dot navigator */}
        <div className="hidden items-center gap-1 sm:flex">
          {attempt.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-4 bg-[oklch(var(--spark))]'
                  : answers[q.id]
                  ? 'bg-[oklch(var(--spark)/0.4)]'
                  : 'bg-[oklch(var(--border))]'
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-[oklch(var(--spark))] px-5 py-2.5 text-sm font-semibold text-[oklch(var(--ocean-950))] transition-all hover:shadow-[0_0_20px_oklch(var(--spark)/0.4)] active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting…' : 'Submit Quiz'}
            <Trophy className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            className="flex items-center gap-1.5 rounded-xl border border-[oklch(var(--border))] px-4 py-2.5 text-sm font-medium text-[oklch(var(--foreground)/0.7)] transition-colors hover:border-[oklch(var(--border)/2)] hover:text-[oklch(var(--foreground))]"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Submit confirmation overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="mx-4 w-full max-w-sm border-[oklch(var(--border))] bg-[oklch(var(--card))]">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-400" />
              <h3 className="font-display mb-2 text-lg font-bold text-[oklch(var(--foreground))]">
                Submit Quiz?
              </h3>
              <p className="mb-1 text-sm text-[oklch(var(--muted-foreground))]">
                You have answered{' '}
                <span className="font-semibold text-[oklch(var(--foreground))]">
                  {answered} of {total}
                </span>{' '}
                questions.
              </p>
              {answered < total && (
                <p className="mb-4 text-xs text-amber-400">
                  {total - answered} question{total - answered > 1 ? 's' : ''} unanswered.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-xl border border-[oklch(var(--border))] py-2.5 text-sm font-medium text-[oklch(var(--foreground)/0.7)] hover:text-[oklch(var(--foreground))]"
                >
                  Keep Going
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[oklch(var(--spark))] py-2.5 text-sm font-semibold text-[oklch(var(--ocean-950))] hover:shadow-[0_0_16px_oklch(var(--spark)/0.3)] disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting…' : 'Confirm'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ── Results screen ────────────────────────────────────────────
function ResultsScreen({
  result,
  attempt,
  quizTitle,
  passingScore,
  onRetry,
  onBack,
}: {
  result:       QuizResult
  attempt:      QuizAttempt
  quizTitle:    string
  passingScore: number
  onRetry:      () => void
  onBack:       () => void
}) {
  const passed      = result.passed
  const scoreColor  = passed
    ? 'text-green-400'
    : 'text-red-400'
  const scoreBg     = passed
    ? 'bg-green-500/10 border-green-500/20'
    : 'bg-red-500/10 border-red-500/20'

  return (
    <div className="mx-auto max-w-2xl space-y-5">

      {/* Score hero */}
      <Card className={`border ${scoreBg} bg-[oklch(var(--card))]`}>
        <CardContent className="p-8 text-center">
          <div className={`mb-2 text-6xl font-bold font-display ${scoreColor}`}>
            {result.percentage}%
          </div>

          <div className={`mb-1 text-lg font-semibold ${scoreColor}`}>
            {passed ? '🎉 Passed!' : '😓 Not quite'}
          </div>

          <p className="text-sm text-[oklch(var(--muted-foreground))]">
            {result.score} / {result.totalPoints} points
            · Passing score: {passingScore}%
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-xl border border-[oklch(var(--border))] px-5 py-2.5 text-sm font-medium text-[oklch(var(--foreground)/0.7)] hover:border-[oklch(var(--spark)/0.3)] hover:text-[oklch(var(--foreground))]"
            >
              <RotateCcw className="h-4 w-4" />
              Retake
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-xl bg-[oklch(var(--spark))] px-5 py-2.5 text-sm font-semibold text-[oklch(var(--ocean-950))] hover:shadow-[0_0_16px_oklch(var(--spark)/0.3)]"
            >
              All Quizzes
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Per-question breakdown */}
      <Card className="border-[oklch(var(--border))] bg-[oklch(var(--card))]">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base text-[oklch(var(--foreground))]">
            Question Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-[oklch(var(--muted-foreground))]">
            Review each answer with explanations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {attempt.questions.map((question, idx) => {
            const answer = result.answers.find((a) => a.questionId === question.id)
            if (!answer) return null
            return (
              <div
                key={question.id}
                className={`rounded-xl border p-4 ${
                  answer.isCorrect
                    ? 'border-green-500/20 bg-green-500/5'
                    : 'border-red-500/20 bg-red-500/5'
                }`}
              >
                <div className="mb-2 flex items-start gap-3">
                  {answer.isCorrect
                    ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    : <XCircle     className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  }
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[oklch(var(--foreground))]">
                      <span className="text-[oklch(var(--muted-foreground))]">
                        Q{idx + 1}.{' '}
                      </span>
                      {question.text}
                    </p>
                    <p className="mt-1 text-xs text-[oklch(var(--muted-foreground))]">
                      {answer.pointsAwarded} / {question.points} points
                    </p>
                  </div>
                </div>

                {answer.explanation && (
                  <div className="mt-2 rounded-lg bg-[oklch(var(--foreground)/0.04)] px-3 py-2">
                    <p className="text-xs leading-relaxed text-[oklch(var(--foreground)/0.7)]">
                      <span className="font-semibold text-[oklch(var(--foreground)/0.9)]">
                        Explanation:{' '}
                      </span>
                      {answer.explanation}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Main orchestrator ─────────────────────────────────────────
export default function QuizModule() {
  const [screen,      setScreen]      = useState<Screen>('list')
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [attempt,     setAttempt]     = useState<QuizAttempt | null>(null)
  const [result,      setResult]      = useState<QuizResult | null>(null)

  const { data: quizzes = [] } = useAvailableQuizzes()
  const startMutation  = useStartQuiz()
  const submitMutation = useSubmitQuiz()

  const handleStart = async (quizId: string) => {
    setActiveQuizId(quizId)
    const data = await startMutation.mutateAsync(quizId)
    setAttempt(data)
    setScreen('taking')
  }

  const handleSubmit = async (answers: AnswerMap) => {
    if (!activeQuizId) return
    const answerArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }))
    const data = await submitMutation.mutateAsync({
      quizId: activeQuizId,
      answers: answerArray,
    })
    setResult(data)
    setScreen('result')
  }

  const handleRetry = async () => {
    if (!activeQuizId) return
    setResult(null)
    setAttempt(null)
    setScreen('list')
    await handleStart(activeQuizId)
  }

  const handleBack = () => {
    setScreen('list')
    setAttempt(null)
    setResult(null)
    setActiveQuizId(null)
  }

  // Loading state while starting
  if (startMutation.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-center rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[oklch(var(--spark))] border-t-transparent" />
            <p className="text-sm text-[oklch(var(--muted-foreground))]">
              Preparing your quiz…
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'list') {
    return <QuizListScreen onStart={handleStart} />
  }

  if (screen === 'taking' && attempt) {
    return (
      <TakingQuizScreen
        attempt={attempt}
        onSubmit={handleSubmit}
        isSubmitting={submitMutation.isPending}
      />
    )
  }

  if (screen === 'result' && result && attempt) {
    const quiz = quizzes.find((q) => q.id === activeQuizId)
    return (
      <ResultsScreen
        result={result}
        attempt={attempt}
        quizTitle={quiz?.title ?? 'Quiz'}
        passingScore={quiz?.passingScore ?? 70}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    )
  }

  return null
}