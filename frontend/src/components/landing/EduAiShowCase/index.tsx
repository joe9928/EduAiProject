// src/components/landing/EduAIShowcase/index.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { Brain, Sparkles, ArrowRight } from 'lucide-react'
import ChatWindow from './ChatWindow'

//self register 
gsap.registerPlugin(ScrollTrigger)

export default function EduAIShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return

    const ctx = gsap.context(() => {
      // This ScrollTrigger pins the sticky inner div while the outer
      // section scrolls — creating the cinematic locked-scroll effect.
      // scrub: true means progress is tied 1:1 to scroll position.
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: sticky,
        scrub: false, // we drive state manually via onUpdate
        onUpdate: (self) => {
          // Feed raw scroll progress (0→1) into React state
          // This drives ChatWindow's conditional rendering
          setScrollProgress(self.progress)
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    // Outer section is TALL — 300vh gives us scroll room
    // The inner sticky div stays viewport-height while parent scrolls
    <section
      ref={sectionRef}
      id="eduai"
      className="relative bg-[#000810]"
      style={{ height: '300vh' }}
    >
      {/* Sticky container — this is what gets pinned */}
      <div
        ref={stickyRef}
        className="flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6 lg:px-8"
      >
        {/* Background ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-ocean-600/30 bg-ocean-900/40 mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
              <Brain className="text-spark h-3.5 w-3.5" />
              <span className="text-ice/60 text-xs font-medium tracking-widest uppercase">
                Meet EduAI
              </span>
            </div>

            <h2 className="font-display text-ice text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Your personal{' '}
              <span className="text-gradient-spark">AI tutor</span>
              <br />
              that never sleeps
            </h2>

            <p className="text-ice/50 mt-5 text-sm leading-relaxed sm:text-base lg:max-w-sm">
              Ask anything. Get explanations tailored to your level, instant
              quizzes to reinforce learning, and personalised recommendations —
              all in one conversation.
            </p>

            {/* Animated progress indicators */}
            <div className="mt-8 flex flex-col gap-4">
              {[
                {
                  label: 'Concept explained',
                  active: scrollProgress >= 0.25,
                },
                {
                  label: 'Quiz generated',
                  active: scrollProgress >= 0.65,
                },
                {
                  label: 'Path recommended',
                  active: scrollProgress >= 0.85,
                },
              ].map(({ label, active }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                      active
                        ? 'border-spark bg-spark/20 shadow-[0_0_10px_rgba(0,212,255,0.3)]'
                        : 'border-white/15 bg-white/5'
                    }`}
                  >
                    {active && <Sparkles className="text-spark h-3 w-3" />}
                    {!active && (
                      <span className="text-ice/30 text-[10px] font-bold">
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-500 ${
                      active ? 'text-ice' : 'text-ice/30'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="/register"
                className={[
                  'group inline-flex items-center gap-2',
                  'text-spark text-sm font-semibold',
                  'transition-all duration-300 hover:gap-3',
                ].join(' ')}
              >
                Try EduAI free
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Right — live chat demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
            className="w-full"
          >
            <ChatWindow progress={scrollProgress} />
          </motion.div>
        </div>

        {/* Scroll hint — fades out as user scrolls */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-ice/30 text-xs">
              Scroll to see EduAI in action
            </span>
            <div className="h-8 w-5 rounded-full border border-white/20 p-1">
              <motion.div
                className="bg-spark/60 mx-auto h-1.5 w-1.5 rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
