// src/components/landing/EduAIShowcase/QuizPreviewCard.tsx
'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Zap } from 'lucide-react'

const QUIZ_DATA = {
  question: 'Which algorithm has O(n log n) average time complexity?',
  options: ['Bubble Sort', 'Quick Sort', 'Linear Search', 'Binary Search'],
  correct: 1,
}

interface QuizPreviewCardProps {
  isVisible: boolean
}

export default function QuizPreviewCard({ isVisible }: QuizPreviewCardProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-3 overflow-hidden rounded-2xl border border-spark/20 bg-gradient-to-br from-ocean-900/90 to-ocean-950 shadow-[0_8px_32px_rgba(0,212,255,0.1)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-spark/5 px-4 py-2.5">
        <Zap className="h-3.5 w-3.5 text-spark" />
        <span className="text-xs font-semibold tracking-wide text-spark">
          AI-Generated Quiz
        </span>
      </div>

      {/* Question */}
      <div className="px-4 pb-3 pt-4">
        <p className="mb-3 text-sm font-medium text-ice/90">
          {QUIZ_DATA.question}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {QUIZ_DATA.options.map((option, i) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-xs transition-colors ${
                i === QUIZ_DATA.correct
                  ? 'border-spark/40 bg-spark/10 text-spark'
                  : 'border-white/[0.07] bg-white/[0.02] text-ice/50'
              }`}
            >
              {i === QUIZ_DATA.correct ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0" />
              )}
              {option}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}