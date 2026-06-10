// src/app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  User,
  CheckCircle2,
  BookOpen,
  Brain,
} from 'lucide-react'
import TextType from '@/components/reactBits/TextType'
import { GoogleIcon, GitHubIcon } from '@/components/icons/SocialIcons'

const TYPING_PHRASES = [
  'Start your journey.',
  'AI learns with you.',
  'Unlock your potential.',
  'Skills that matter.',
  'Learn. Grow. Excel.',
]

// Password strength checker
function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  if (password.length === 0) return { score: 0, label: '', color: '' }
  if (password.length < 6)
    return { score: 1, label: 'Weak', color: 'oklch(0.577 0.245 27)' }

  let score = 1
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2)
    return { score, label: 'Weak', color: 'oklch(0.577 0.245 27)' }
  if (score <= 3) return { score, label: 'Fair', color: 'oklch(0.75 0.15 60)' }
  if (score <= 4) return { score, label: 'Good', color: 'oklch(0.75 0.15 150)' }
  return { score, label: 'Strong', color: 'oklch(var(--spark))' }
}

// What learners get — shown on left panel
const PERKS = [
  {
    icon: Brain,
    title: 'Adaptive AI Tutor',
    description: 'Learns your pace and style',
  },
  {
    icon: BookOpen,
    title: '500+ Courses',
    description: 'From beginner to expert',
  },
  {
    icon: Sparkles,
    title: 'AI Quiz Generation',
    description: 'Reinforce every concept',
  },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const strength = getPasswordStrength(password)

  const handleSubmit = () => {
    if (!agreedToTerms) return
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* ─── LEFT PANEL ─────────────────────────────── */}
      <div
        className="relative hidden w-1/2 flex-col overflow-hidden md:flex"
        style={{
          background:
            'linear-gradient(160deg, oklch(var(--ocean-900)) 0%, oklch(var(--ocean-950)) 60%, #000810 100%)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 80% 20%, oklch(var(--spark) / 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Top border accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(var(--spark)/0.4)] to-transparent" />

        {/* Logo */}
       

        {/* Center content */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-10 pb-10">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[oklch(var(--spark)/0.25)] bg-[oklch(var(--spark)/0.08)] px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(var(--spark))]" />
            <span className="text-xs font-medium tracking-widest text-[oklch(var(--spark))] uppercase">
              Free Forever Plan
            </span>
          </div>

          {/* Static + animated headline */}
          <h1 className="font-display mb-3 text-4xl leading-tight font-bold text-[oklch(var(--foreground))] xl:text-5xl">
            Begin your path
            <br />
            to
          </h1>
          <div className="font-display mb-8 text-4xl font-bold xl:text-5xl">
            <TextType
              text={TYPING_PHRASES}
              typingSpeed={65}
              deletingSpeed={40}
              pauseDuration={2000}
              loop
              showCursor
              cursorCharacter="_"
              cursorClassName="text-[oklch(var(--spark))]"
              className="text-gradient-spark"
            />
          </div>

          <p className="mb-10 max-w-sm text-sm leading-relaxed text-[oklch(var(--foreground)/0.5)]">
            Create your free account and get instant access to AI-powered
            learning, personalized paths, and a global community of learners.
          </p>

          {/* Perks list */}
          <div className="flex flex-col gap-4">
            {PERKS.map((perk) => {
              const Icon = perk.icon
              return (
                <div key={perk.title} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[oklch(var(--spark)/0.2)] bg-[oklch(var(--spark)/0.08)]">
                    <Icon className="h-4 w-4 text-[oklch(var(--spark))]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[oklch(var(--foreground))]">
                      {perk.title}
                    </p>
                    <p className="text-xs text-[oklch(var(--foreground)/0.45)]">
                      {perk.description}
                    </p>
                  </div>
                  <CheckCircle2 className="ml-auto h-4 w-4 text-[oklch(var(--spark)/0.6)]" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ─── RIGHT PANEL — FORM ─────────────────────── */}
      <div
        className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2"
        style={{ background: 'oklch(var(--background))' }}
      >
        {/* Mobile logo */}
        

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-[oklch(var(--foreground))]">
              Create account
            </h2>
            <p className="mt-2 text-sm text-[oklch(var(--muted-foreground))]">
              Free forever — no credit card required
            </p>
          </div>

          {/* Social signup */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] text-sm font-medium text-[oklch(var(--foreground)/0.8)] transition-all duration-200 hover:border-[oklch(var(--spark)/0.4)] hover:bg-[oklch(var(--foreground)/0.04)]"
            >
              <GoogleIcon className="h-4 w-4" />
              Google
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] text-sm font-medium text-[oklch(var(--foreground)/0.8)] transition-all duration-200 hover:border-[oklch(var(--spark)/0.4)] hover:bg-[oklch(var(--foreground)/0.04)]"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[oklch(var(--border))]" />
            <span className="text-xs text-[oklch(var(--muted-foreground))]">
              or register with email
            </span>
            <div className="h-px flex-1 bg-[oklch(var(--border))]" />
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Full name */}
            <div className="flex h-12 items-center gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4 transition-colors duration-200 focus-within:border-[oklch(var(--spark)/0.5)] focus-within:bg-[oklch(var(--foreground)/0.03)]">
              <User className="h-4 w-4 shrink-0 text-[oklch(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Full name"
                className="h-full w-full bg-transparent text-sm text-[oklch(var(--foreground))] placeholder-[oklch(var(--muted-foreground)/0.6)] outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="flex h-12 items-center gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4 transition-colors duration-200 focus-within:border-[oklch(var(--spark)/0.5)] focus-within:bg-[oklch(var(--foreground)/0.03)]">
              <Mail className="h-4 w-4 shrink-0 text-[oklch(var(--muted-foreground))]" />
              <input
                type="email"
                placeholder="Email address"
                className="h-full w-full bg-transparent text-sm text-[oklch(var(--foreground))] placeholder-[oklch(var(--muted-foreground)/0.6)] outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4 transition-colors duration-200 focus-within:border-[oklch(var(--spark)/0.5)] focus-within:bg-[oklch(var(--foreground)/0.03)]">
                <Lock className="h-4 w-4 shrink-0 text-[oklch(var(--muted-foreground))]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-full w-full bg-transparent text-sm text-[oklch(var(--foreground))] placeholder-[oklch(var(--muted-foreground)/0.6)] outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="shrink-0 text-[oklch(var(--muted-foreground))] transition-colors hover:text-[oklch(var(--foreground))]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            level <= strength.score
                              ? strength.color
                              : 'oklch(var(--border))',
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: strength.color }}
                  >
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex h-12 items-center gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4 transition-colors duration-200 focus-within:border-[oklch(var(--spark)/0.5)] focus-within:bg-[oklch(var(--foreground)/0.03)]">
              <Lock className="h-4 w-4 shrink-0 text-[oklch(var(--muted-foreground))]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className="h-full w-full bg-transparent text-sm text-[oklch(var(--foreground))] placeholder-[oklch(var(--muted-foreground)/0.6)] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="shrink-0 text-[oklch(var(--muted-foreground))] transition-colors hover:text-[oklch(var(--foreground))]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms agreement */}
          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[oklch(var(--border))] accent-[oklch(var(--spark))]"
            />
            <span className="text-sm text-[oklch(var(--muted-foreground))]">
              I agree to the{' '}
              <Link
                href="/terms"
                className="text-[oklch(var(--spark))] transition-opacity hover:opacity-75"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-[oklch(var(--spark))] transition-opacity hover:opacity-75"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !agreedToTerms}
            className="group relative mt-6 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[oklch(var(--spark))] text-sm font-semibold text-[oklch(var(--ocean-950))] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_oklch(var(--spark)/0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[oklch(var(--ocean-950))] border-t-transparent" />
            ) : (
              <>
                Create free account
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
            {/* Shimmer */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-[oklch(var(--muted-foreground))]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-[oklch(var(--spark))] transition-opacity hover:opacity-75"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
