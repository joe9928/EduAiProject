// src/components/landing/EduAIShowcase/ChatWindow.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, Battery, Signal } from 'lucide-react'
import AIMessage from './AIMessage'
import QuizPreviewCard from './QuizPreviewCard'

const CONVERSATION = [
  {
    role: 'user' as const,
    message: "I'm struggling with sorting algorithms. Can you help?",
    act: 0,
  },
  {
    role: 'ai' as const,
    message:
      "Of course! Sorting algorithms are fundamental. Let's start with the key ones: Bubble Sort is simple but slow O(n²), while Quick Sort averages O(n log n) making it practical for large datasets. Want me to generate a quick quiz to test your understanding?",
    act: 1,
  },
]

interface ChatWindowProps {
  progress: number // 0 → 1 driven by scroll
}

export default function ChatWindow({ progress }: ChatWindowProps) {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [showRecommendation, setShowRecommendation] = useState(false)
  const [aiTypingDone, setAiTypingDone] = useState(false)

  // Drive visibility from scroll progress
  useEffect(() => {
    if (progress >= 0.08 && !visibleMessages.includes(0)) {
      setVisibleMessages([0])
    }
    if (progress >= 0.25 && !visibleMessages.includes(1)) {
      setVisibleMessages([0, 1])
    }
    if (progress >= 0.65 && aiTypingDone) {
      setShowQuiz(true)
    }
    if (progress >= 0.85) {
      setShowRecommendation(true)
    }
  }, [progress, aiTypingDone, visibleMessages])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#020e18]/90 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Phone-style top bar */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-spark shadow-[0_0_6px_rgba(0,212,255,0.8)]" />
          <span className="font-display text-sm font-semibold text-ice">
            EduAI Assistant
          </span>
          <span className="rounded-full bg-spark/15 px-2 py-0.5 text-[10px] font-medium text-spark">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-ice/30">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex min-h-[320px] flex-col gap-4 p-4">
        <AnimatePresence>
          {CONVERSATION.map((msg, i) => (
            <AIMessage
              key={i}
              message={msg.message}
              isVisible={visibleMessages.includes(i)}
              role={msg.role}
              typingSpeed={18}
              onComplete={() => {
                if (msg.role === 'ai') setAiTypingDone(true)
              }}
            />
          ))}
        </AnimatePresence>

        {/* Quiz card appears after AI finishes */}
        <QuizPreviewCard isVisible={showQuiz} />

        {/* Recommendation chip */}
        <AnimatePresence>
          {showRecommendation && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-1 flex items-center gap-3 rounded-xl border border-ocean-600/30 bg-ocean-900/60 px-3 py-2.5"
            >
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-spark" />
              <p className="text-xs text-ice/60">
                <span className="font-semibold text-ice/80">EduAI recommends: </span>
                "Data Structures Fundamentals" — based on your quiz results
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll progress indicator at bottom */}
      <div className="h-0.5 w-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-spark to-ocean-400"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}