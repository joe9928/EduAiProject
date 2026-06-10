// src/components/landing/TestimonialsSection/index.tsx
'use client'

import { useRef } from 'react'
import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'EduLearn completely changed how I study. The AI actually knows when I am struggling before I do — it reshapes my entire learning path overnight.',
    name: 'Amara Osei',
    role: 'Computer Science Student',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
  },
  {
    id: 2,
    quote:
      'As a lecturer, the at-risk detection dashboard is invaluable. I caught three students heading toward failure early enough to actually help them.',
    name: 'Dr. Marcus Webb',
    role: 'Senior Lecturer, Data Science',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    id: 3,
    quote:
      'The AI-generated quizzes are frighteningly good. Every question feels handcrafted for exactly where I am in the material.',
    name: 'Priya Nair',
    role: 'MBA Candidate',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
  },
  {
    id: 4,
    quote:
      "I've tried every major e-learning platform. EduLearn is the first one where I actually finished a course — the adaptive path kept me engaged.",
    name: 'Carlos Mendez',
    role: 'Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: 5,
    quote:
      'The discussion forums combined with AI summaries are brilliant. I get the depth of peer learning without drowning in noise.',
    name: 'Yuki Tanaka',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  {
    id: 6,
    quote:
      'Our institution deployed EduLearn across three departments. Completion rates went from 61% to 89% in one semester. The data does not lie.',
    name: 'Prof. Sarah Okonkwo',
    role: 'Dean of Digital Learning',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: 7,
    quote:
      'Studying for my certification felt like having a personal tutor available at 3am. EduAI never gets tired of my questions.',
    name: 'James Oduya',
    role: 'Cloud Engineering Student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    id: 8,
    quote:
      'The analytics dashboard showed me I learn best between 9–11pm and retain more from video than text. That insight alone was worth it.',
    name: 'Fatima Al-Rashid',
    role: 'UX Research Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
  {
    id: 9,
    quote:
      'Building courses on EduLearn is a joy. The module structure maps perfectly to how learners actually think, not how academics organise slides.',
    name: 'Tom Eriksson',
    role: 'Independent Educator',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
  },
]

// Split into 3 columns of 3
const COLUMNS = [
  { testimonials: TESTIMONIALS.slice(0, 3), animClass: 'animate-scroll-up-slow', },
  { testimonials: TESTIMONIALS.slice(3, 6), animClass: 'animate-scroll-down-fast', },
  { testimonials: TESTIMONIALS.slice(6, 9), animClass: 'animate-scroll-up-medium', },
]

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof TESTIMONIALS)[0]
}) {
  return (
    <div className="glass mb-4 rounded-2xl p-5 transition-all duration-300 hover:border-white/[0.15]">
      {/* Quote icon */}
      <div className="mb-3">
        <Quote className="h-4 w-4 text-spark opacity-70" />
      </div>

      {/* Quote text */}
      <p className="mb-4 text-sm leading-relaxed text-ice/60">
        {testimonial.quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="h-9 w-9 rounded-full border border-white/10 object-cover"
        />
        <div>
          <p className="text-sm font-medium text-ice/90">{testimonial.name}</p>
          <p className="text-xs text-ice/40">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialColumn({
  testimonials,
  animClass,
}: {
  testimonials: (typeof TESTIMONIALS)
  animClass: string
}) {
  return (
    // Duplicate cards to create seamless infinite loop
    <div className={animClass}>
      {[...testimonials, ...testimonials].map((t, i) => (
        <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="relative bg-[#000810] px-6 py-24 lg:px-8 lg:py-32">
      {/* Section divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocean-600/40 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ocean-600/30 bg-ocean-900/40 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-spark" />
            <span className="text-xs font-medium uppercase tracking-widest text-ice/60">
              Student Stories
            </span>
          </div>
          <h2 className="font-display mt-4 text-3xl font-bold text-ice sm:text-4xl lg:text-5xl">
            Learners who{' '}
            <span className="text-gradient-spark">never looked back</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ice/50 sm:text-base">
            From students to seasoned educators — real people, real outcomes.
          </p>
        </div>

        {/* 
          Columns container:
          - Mobile: 1 column
          - md: 2 columns  
          - lg: 3 columns
          Overflow hidden + fade masks at top/bottom
        */}
        <div className="relative h-[640px] overflow-hidden">
          {/* Top fade mask */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#000810] to-transparent" />
          {/* Bottom fade mask */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#000810] to-transparent" />

          <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {COLUMNS.map((col, i) => (
              <div
                key={i}
                className={`overflow-hidden ${
                  i === 1 ? 'hidden md:block' : ''
                } ${i === 2 ? 'hidden lg:block' : ''}`}
              >
                <TestimonialColumn
                  testimonials={col.testimonials}
                  animClass={col.animClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}