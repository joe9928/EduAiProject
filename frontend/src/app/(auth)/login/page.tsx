// src/app/(auth)/login/page.tsx
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
  Users,
  TrendingUp,
} from 'lucide-react'
import TextType from '@/components/reactBits/TextType'
import { GoogleIcon, GitHubIcon } from '@/components/icons/SocialIcons'

// Phrases cycling on the left panel
const TYPING_PHRASES = [
  'Learn at your own pace.',
  'AI adapts to you.',
  'Master any skill.',
  'Your goals. Your path.',
  'Study smarter today.',
]

// Floating stat pills shown on left panel
const STATS = [
  { icon: Users, value: '24K+', label: 'Active Learners' },
  { icon: Sparkles, value: '1.2M+', label: 'AI Recommendations' },
  { icon: TrendingUp, value: '94%', label: 'Completion Rate' },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
    // wire to API later
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* ─── LEFT PANEL ─────────────────────────────── */}
      {/* Hidden on mobile, shown md+ */}
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
              'radial-gradient(ellipse 80% 60% at 20% 80%, oklch(var(--spark) / 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Top border accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(var(--spark)/0.4)] to-transparent" />

        {/* Center content */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-10 pb-10">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[oklch(var(--spark)/0.25)] bg-[oklch(var(--spark)/0.08)] px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(var(--spark))]" />
            <span className="text-xs font-medium tracking-widest text-[oklch(var(--spark))] uppercase">
              AI-Powered Learning
            </span>
          </div>

          {/* Static headline */}
          <h1 className="font-display mb-3 text-4xl leading-tight font-bold text-[oklch(var(--foreground))] xl:text-5xl">
            The future of
            <br />
            education is
          </h1>

          {/* Animated typewriter line */}
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
            Join thousands of learners using EduLearn's adaptive AI to master
            new skills faster than ever before.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-2.5 rounded-2xl border border-[oklch(var(--foreground)/0.08)] bg-[oklch(var(--foreground)/0.04)] px-4 py-2.5 backdrop-blur-sm"
                >
                  <div className="rounded-lg bg-[oklch(var(--primary)/0.4)] p-1.5">
                    <Icon className="h-3.5 w-3.5 text-[oklch(var(--spark))]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[oklch(var(--foreground))]">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-[oklch(var(--foreground)/0.45)]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom grid pattern — decorative */}
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
        {/* Mobile logo — only visible when left panel is hidden */}
        

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-[oklch(var(--foreground))]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[oklch(var(--muted-foreground))]">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Social login buttons */}
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
              or continue with email
            </span>
            <div className="h-px flex-1 bg-[oklch(var(--border))]" />
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
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
            <div className="flex h-12 items-center gap-3 rounded-xl border border-[oklch(var(--border))] bg-[oklch(var(--card))] px-4 transition-colors duration-200 focus-within:border-[oklch(var(--spark)/0.5)] focus-within:bg-[oklch(var(--foreground)/0.03)]">
              <Lock className="h-4 w-4 shrink-0 text-[oklch(var(--muted-foreground))]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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
          </div>

          {/* Remember me + Forgot password */}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[oklch(var(--border))] accent-[oklch(var(--spark))]"
              />
              <span className="text-sm text-[oklch(var(--muted-foreground))]">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[oklch(var(--spark))] transition-opacity hover:opacity-75"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="group relative mt-6 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[oklch(var(--spark))] text-sm font-semibold text-[oklch(var(--ocean-950))] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_oklch(var(--spark)/0.4)] active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[oklch(var(--ocean-950))] border-t-transparent" />
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
            {/* Shimmer */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-[oklch(var(--muted-foreground))]">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-[oklch(var(--spark))] transition-opacity hover:opacity-75"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
