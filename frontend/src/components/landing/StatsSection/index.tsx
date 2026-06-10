// src/components/landing/StatsSection/index.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, Sparkles, TrendingUp, Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  {
    icon: Users,
    value: 24000,
    suffix: '+',
    label: 'Active Learners',
    description: 'Students actively learning on the platform',
    accent: '#00D4FF',
  },
  {
    icon: Sparkles,
    value: 1.2,
    suffix: 'M+',
    decimals: 1,
    label: 'AI Recommendations',
    description: 'Personalised learning nudges delivered',
    accent: '#4DBDD4',
  },
  {
    icon: TrendingUp,
    value: 94,
    suffix: '%',
    label: 'Completion Rate',
    description: 'Students who finish what they start',
    accent: '#00D4FF',
  },
  {
    icon: Globe,
    value: 48,
    suffix: '',
    label: 'Countries Reached',
    description: 'A truly global learning community',
    accent: '#4DBDD4',
  },
]

function useCountUp(
  target: number,
  decimals: number = 0,
  triggered: boolean
) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!triggered) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(current + increment, target)
      setCount(parseFloat(current.toFixed(decimals)))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [triggered, target, decimals])

  return count
}

function StatCard({
  stat,
  index,
  triggered,
}: {
  stat: (typeof STATS)[0]
  index: number
  triggered: boolean
}) {
  const Icon = stat.icon
  const count = useCountUp(stat.value, stat.decimals ?? 0, triggered)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: index * 0.12,
          ease: 'power3.out',
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
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-ocean-900/60 to-ocean-950/80 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.14] sm:p-8"
      style={{ opacity: 0 }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${stat.accent}18 0%, transparent 70%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${stat.accent}60, transparent)`,
        }}
      />

      {/* Icon */}
      <div
        className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
        style={{
          background: `${stat.accent}15`,
          border: `1px solid ${stat.accent}30`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: stat.accent }} />
      </div>

      {/* Animated number */}
      <div className="font-display mb-1 text-4xl font-bold tracking-tight text-ice sm:text-5xl">
        {stat.decimals ? count.toFixed(stat.decimals) : Math.floor(count)}
        <span style={{ color: stat.accent }}>{stat.suffix}</span>
      </div>

      <p className="mb-1 text-sm font-semibold text-ice/80">{stat.label}</p>
      <p className="text-xs leading-relaxed text-ice/40">{stat.description}</p>
    </div>
  )
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Trigger count-up when section enters viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => setTriggered(true),
      })

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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#000810] px-6 py-24 lg:px-8 lg:py-32"
    >
      {/* Section divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocean-600/40 to-transparent" />

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,78,100,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div
          ref={headingRef}
          className="mb-16 text-center"
          style={{ opacity: 0 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ocean-600/30 bg-ocean-900/40 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-spark" />
            <span className="text-xs font-medium uppercase tracking-widest text-ice/60">
              By The Numbers
            </span>
          </div>
          <h2 className="font-display mt-4 text-3xl font-bold text-ice sm:text-4xl lg:text-5xl">
            Results that speak{' '}
            <span className="text-gradient-spark">for themselves</span>
          </h2>
        </div>

        {/* Stats grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={i}
              triggered={triggered}
            />
          ))}
        </div>
      </div>
    </section>
  )
}