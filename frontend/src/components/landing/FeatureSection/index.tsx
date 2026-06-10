// src/components/landing/FeaturesSection/index.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Brain, BarChart3, MessageSquare,
  ShieldCheck, Zap, BookOpen,
} from 'lucide-react'
import BorderGlow from '@/components/reactBits/BorderGlow'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    icon: Brain,
    title: 'Adaptive AI Learning Paths',
    description:
      'EduAI analyses your performance in real time and dynamically reshapes your curriculum — surfacing concepts you need, skipping what you already know.',
    accent: '#00D4FF',
    glowColor: '190 100 50',
    colors: ['#00D4FF', '#4DBDD4', '#002D3D'],
    size: 'large',
  },
  {
    icon: BarChart3,
    title: 'Deep Performance Analytics',
    description:
      'Granular dashboards for students and lecturers. Track mastery, time-on-task, and risk signals before they become problems.',
    accent: '#4DBDD4',
    glowColor: '185 60 55',
    colors: ['#4DBDD4', '#00D4FF', '#001B24'],
    size: 'small',
  },
  {
    icon: Zap,
    title: 'AI Quiz Generation',
    description:
      'Instantly generate contextual quizzes from any lesson content. Every question reviewed by AI for pedagogical soundness.',
    accent: '#80D4E6',
    glowColor: '192 70 70',
    colors: ['#80D4E6', '#4DBDD4', '#002D3D'],
    size: 'small',
  },
  {
    icon: MessageSquare,
    title: 'Discussion & Collaboration',
    description:
      'Threaded forums, real-time Q&A, and peer study groups woven directly into the learning flow.',
    accent: '#4DBDD4',
    glowColor: '185 60 55',
    colors: ['#4DBDD4', '#00D4FF', '#001B24'],
    size: 'small',
  },
  {
    icon: ShieldCheck,
    title: 'At-Risk Student Detection',
    description:
      'Proprietary risk scoring flags disengaged students early — giving lecturers time to intervene before it affects outcomes.',
    accent: '#00D4FF',
    glowColor: '190 100 50',
    colors: ['#00D4FF', '#4DBDD4', '#002D3D'],
    size: 'small',
  },
  {
    icon: BookOpen,
    title: 'Structured Course Builder',
    description:
      'Modules, lessons, video, PDF, and external content — organized into a hierarchy that guides students from concept to mastery.',
    accent: '#80D4E6',
    glowColor: '192 70 70',
    colors: ['#80D4E6', '#4DBDD4', '#002D3D'],
    size: 'small',
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0]
  index: number
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const Icon = feature.icon
  const isLarge = feature.size === 'large'

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'power3.out',
          delay: (index % 3) * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [index])

  return (
    // Wrapper div owns the GSAP animation + sizing
    <div
      ref={wrapperRef}
      className={`h-full ${isLarge ? 'min-h-[280px]' : 'min-h-[200px]'}`}
      style={{ opacity: 0 }}
    >
      <BorderGlow
        className="h-full w-full"
        backgroundColor="#002030"
        borderRadius={16}
        glowColor={feature.glowColor}
        colors={feature.colors}
        glowRadius={50}
        glowIntensity={1.2}
        edgeSensitivity={25}
        coneSpread={20}
        fillOpacity={0.3}
      >
        {/* Card inner content */}
        <div
          className={`flex h-full flex-col p-6 ${
            isLarge ? 'justify-between sm:p-8' : ''
          }`}
        >
          {/* Icon */}
          <div>
            <div
              className="mb-4 inline-flex w-fit items-center justify-center rounded-xl p-3"
              style={{
                background: `${feature.accent}15`,
                border: `1px solid ${feature.accent}30`,
              }}
            >
              <Icon className="h-5 w-5" style={{ color: feature.accent }} />
            </div>

            <h3 className="font-display mb-2 text-base font-semibold text-ice sm:text-lg">
              {feature.title}
            </h3>
            <p
              className={`leading-relaxed text-ice/50 ${
                isLarge ? 'text-sm sm:text-base' : 'text-sm'
              }`}
            >
              {feature.description}
            </p>
          </div>

          {/* Large card CTA */}
          {isLarge && (
            <div
              className="mt-6 flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3"
              style={{ color: feature.accent }}
            >
              <span>See how it works</span>
              <span className="transition-transform duration-300">→</span>
            </div>
          )}
        </div>
      </BorderGlow>
    </div>
  )
}

export default function FeaturesSection() {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="features"
      className="relative bg-[#000810] px-6 py-24 lg:px-8 lg:py-32"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocean-600/40 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div
          ref={headingRef}
          className="mb-16 text-center"
          style={{ opacity: 0 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ocean-600/30 bg-ocean-900/40 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-spark" />
            <span className="text-xs font-medium tracking-widest text-ice/60 uppercase">
              Platform Capabilities
            </span>
          </div>
          <h2 className="font-display mt-4 text-3xl font-bold text-ice sm:text-4xl lg:text-5xl">
            Everything a modern{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient-spark">learning platform</span>{' '}
            needs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ice/50 sm:text-base">
            Built from the ground up around AI — not bolted on as an afterthought.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <FeatureCard feature={FEATURES[0]} index={0} />
          </div>
          {FEATURES.slice(1).map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}