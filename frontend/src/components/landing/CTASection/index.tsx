// src/components/landing/CTASection/index.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

// Floating particle — pure CSS, no JS needed
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute h-1 w-1 rounded-full bg-spark/40"
      style={style}
    />
  )
}

const PARTICLES = [
  { top: '15%', left: '8%',  animationDelay: '0s',   animationDuration: '4s'  },
  { top: '70%', left: '12%', animationDelay: '1.2s', animationDuration: '5s'  },
  { top: '30%', left: '88%', animationDelay: '0.5s', animationDuration: '3.5s'},
  { top: '75%', left: '82%', animationDelay: '2s',   animationDuration: '4.5s'},
  { top: '50%', left: '5%',  animationDelay: '0.8s', animationDuration: '6s'  },
  { top: '20%', left: '75%', animationDelay: '1.8s', animationDuration: '3s'  },
  { top: '85%', left: '50%', animationDelay: '0.3s', animationDuration: '5.5s'},
  { top: '10%', left: '45%', animationDelay: '2.5s', animationDuration: '4s'  },
]

export default function CTASection() {
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card scales up from slightly below
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Inner content staggers after card appears
      gsap.fromTo(
        '[data-cta-animate]',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative bg-[#000810] px-6 py-24 lg:px-8 lg:py-32">
      {/* Section divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocean-600/40 to-transparent" />

      <div className="mx-auto max-w-5xl">
        {/* The floating card */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl p-px"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,212,255,0.3) 0%, rgba(0,78,100,0.2) 50%, rgba(0,212,255,0.1) 100%)',
            opacity: 0,
          }}
        >
          {/* Inner card surface */}
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20"
            style={{
              background:
                'linear-gradient(160deg, #002D3D 0%, #001B24 40%, #000810 100%)',
            }}
          >
            {/* Central radial glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,212,255,0.12) 0%, transparent 70%)',
              }}
            />

            {/* Floating particles */}
            {PARTICLES.map((p, i) => (
              <Particle
                key={i}
                style={{
                  top: p.top,
                  left: p.left,
                  animation: `float ${p.animationDuration} ease-in-out ${p.animationDelay} infinite`,
                }}
              />
            ))}

            {/* Content */}
            <div ref={contentRef} className="relative z-10">
              {/* Badge */}
              <div
                data-cta-animate
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-spark/30 bg-spark/10 px-4 py-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-spark" />
                <span className="text-xs font-medium uppercase tracking-widest text-spark">
                  Start Learning Today
                </span>
              </div>

              {/* Headline */}
              <h2
                data-cta-animate
                className="font-display mx-auto max-w-2xl text-3xl font-bold leading-tight text-ice sm:text-4xl lg:text-5xl"
              >
                Your smartest learning
                <br />
                decision starts{' '}
                <span className="text-gradient-spark">right here</span>
              </h2>

              {/* Subtext */}
              <p
                data-cta-animate
                className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ice/50 sm:text-base"
              >
                Join 24,000+ learners already using EduLearn. No credit card
                required — your first month is completely free.
              </p>

              {/* CTAs */}
              <div
                data-cta-animate
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  href="/register"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-spark px-8 py-3.5 text-sm font-semibold text-ocean-950 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,212,255,0.45)] active:scale-95 sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  {/* Shimmer */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>

                <Link
                  href="#features"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium text-ice/70 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-ice sm:w-auto"
                >
                  <BookOpen className="h-4 w-4" />
                  Explore Courses
                </Link>
              </div>

              {/* Trust signals */}
              <div
                data-cta-animate
                className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
              >
                {[
                  'No credit card required',
                  'Cancel anytime',
                  'Free forever plan',
                ].map((signal) => (
                  <div
                    key={signal}
                    className="flex items-center gap-1.5 text-xs text-ice/35"
                  >
                    <div className="h-1 w-1 rounded-full bg-spark/50" />
                    {signal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}