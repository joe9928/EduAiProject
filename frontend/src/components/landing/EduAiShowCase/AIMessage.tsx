// src/components/landing/EduAIShowcase/AIMessage.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface AIMessageProps {
  message: string
  isVisible: boolean
  typingSpeed?: number
  onComplete?: () => void
  role: 'user' | 'ai'
}

export default function AIMessage({
  message,
  isVisible,
  typingSpeed = 22,
  onComplete,
  role,
}: AIMessageProps) {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isVisible) return
    // Reset if re-triggered
    indexRef.current = 0
    setDisplayed('')
    setIsDone(false)

    // User messages appear instantly — only AI types
    if (role === 'user') {
      setDisplayed(message)
      setIsDone(true)
      onComplete?.()
      return
    }

    const type = () => {
      if (indexRef.current < message.length) {
        setDisplayed(message.slice(0, indexRef.current + 1))
        indexRef.current++
        timerRef.current = setTimeout(type, typingSpeed)
      } else {
        setIsDone(true)
        onComplete?.()
      }
    }

    timerRef.current = setTimeout(type, 400) // slight delay before AI starts
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isVisible, message, role, typingSpeed, onComplete])

  if (!isVisible && displayed === '') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {role === 'ai' && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-spark/80 to-ocean-500 shadow-[0_0_12px_rgba(0,212,255,0.3)]">
          <Sparkles className="h-3.5 w-3.5 text-ocean-950" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          role === 'user'
            ? 'rounded-tr-sm bg-ocean-700/70 text-ice/90'
            : 'rounded-tl-sm border border-white/10 bg-white/5 text-ice/80'
        }`}
      >
        {displayed}
        {/* Blinking cursor while typing */}
        {role === 'ai' && !isDone && (
          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-spark align-middle" />
        )}
      </div>
    </motion.div>
  )
}