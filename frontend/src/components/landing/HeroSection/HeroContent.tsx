// src/components/landing/HeroSection/HeroContent.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Sparkles, BookOpen, Brain, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HeroContent() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance — each child animates in sequence
      gsap.fromTo(
        '[data-hero-animate]',
        {
          y: 40,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3,
        }
      )
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={contentRef}
      className="relative z-10 flex flex-col items-center px-6 text-center"
    >
      {/* Badge */}
      <div
        data-hero-animate
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-ocean-500/30 bg-ocean-900/50 px-4 py-2 backdrop-blur-sm"
      >
        <Sparkles className="h-3.5 w-3.5 text-spark" />
        <span className="text-xs font-medium tracking-widest text-ice/70 uppercase">
          AI-Powered Learning Platform
        </span>
      </div>

      {/* Headline — mobile: 2.5rem, desktop: 5rem */}
      <h1
        data-hero-animate
        className="font-display max-w-4xl text-[2.5rem] font-bold leading-[1.1] tracking-tight text-ice sm:text-[3.5rem] lg:text-[5rem]"
      >
        Learn Smarter.{' '}
        <span
          className="relative inline-block"
          style={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #4DBDD4 50%, #E6ECF2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Grow Faster.
        </span>
      </h1>

      {/* Subheadline */}
      <p
        data-hero-animate
        className="mt-6 max-w-xl text-base leading-relaxed text-ice/50 sm:text-lg"
      >
        EduLearn combines adaptive AI with world-class content to create a
        learning experience that evolves with you — personalized, intelligent,
        unstoppable.
      </p>

      {/* CTA buttons */}
      <div
        data-hero-animate
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        {/* Primary CTA */}
        <Link
          href="/register"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-spark px-8 py-3.5 text-sm font-semibold text-ocean-950 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] active:scale-95"
        >
          <span>Start Learning Free</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          {/* Shimmer sweep */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        {/* Secondary CTA */}
        <Link
          href="#features"
          className="inline-flex items-center gap-2 rounded-full border border-ice/20 px-8 py-3.5 text-sm font-medium text-ice/70 backdrop-blur-sm transition-all duration-300 hover:border-ice/40 hover:text-ice hover:bg-white/5"
        >
          <BookOpen className="h-4 w-4" />
          <span>Explore Courses</span>
        </Link>
      </div>

      {/* Floating stat pills — mobile: stack, tablet+: row */}
      <div
        data-hero-animate
        className="mt-14 flex flex-wrap justify-center gap-3"
      >
        {[
          { icon: Brain, label: 'AI-Adaptive Paths', value: '10K+' },
          { icon: BookOpen, label: 'Courses', value: '500+' },
          { icon: Zap, label: 'Avg. Completion Rate', value: '94%' },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md"
          >
            <div className="rounded-lg bg-ocean-700/60 p-1.5">
              <Icon className="h-4 w-4 text-spark" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-ice">{value}</p>
              <p className="text-[11px] text-ice/50">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}