// src/components/layout/Navbar/index.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import {
  Menu, X, GraduationCap,
  ChevronRight, LayoutDashboard, LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { logoutUser }   from '@/lib/api/auth'
import { toast }        from 'sonner'

const NAV_LINKS = [
  { label: 'Courses',  href: '#courses'  },
  { label: 'Features', href: '#features' },
  { label: 'EduAI',    href: '#eduai'    },
  { label: 'Pricing',  href: '#pricing'  },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const navRef        = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const { user, accessToken, clearAuth } = useAuthStore()
  const isLoggedIn = !!accessToken && !!user

  // Scroll state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.2 }
      )
    })
    return () => ctx.revert()
  }, [])

  // Mobile menu animation
  useEffect(() => {
    const menu = mobileMenuRef.current
    if (!menu) return
    if (mobileOpen) {
      gsap.fromTo(
        menu,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
      )
    } else {
      gsap.to(menu, {
        height: 0, opacity: 0,
        duration: 0.25, ease: 'power2.in',
      })
    }
  }, [mobileOpen])

  // Close on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch {
      // Even if API call fails, clear local state
    } finally {
      clearAuth()
      toast.success('Signed out successfully.')
      window.location.href = '/'
    }
  }

  // Get initials for avatar
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : ''

  return (
    <header
      ref={navRef}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(var(--spark)/0.8)] to-[oklch(var(--ocean-500))] shadow-[0_0_16px_oklch(var(--spark)/0.3)] transition-all duration-300 group-hover:shadow-[0_0_24px_oklch(var(--spark)/0.5)]">
            <GraduationCap className="h-4 w-4 text-[oklch(var(--ocean-950))]" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[oklch(var(--foreground))]">
            Edu<span className="text-[oklch(var(--spark))]">Learn</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative text-sm font-medium text-[oklch(var(--foreground)/0.6)] transition-colors duration-200 hover:text-[oklch(var(--foreground))] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[oklch(var(--spark))] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs — conditional on auth state */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {/* Avatar + name */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(var(--primary))] to-[oklch(var(--spark)/0.6)] text-xs font-bold text-[oklch(var(--foreground))]">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[oklch(var(--foreground)/0.8)]">
                  {user?.firstName}
                </span>
              </div>

              {/* Go to dashboard */}
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-1.5 rounded-full border border-[oklch(var(--spark)/0.3)] bg-[oklch(var(--spark)/0.08)] px-5 py-2 text-sm font-semibold text-[oklch(var(--spark))] transition-all duration-300 hover:bg-[oklch(var(--spark)/0.15)]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[oklch(var(--border))] text-[oklch(var(--muted-foreground))] transition-colors hover:border-red-500/30 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[oklch(var(--foreground)/0.6)] transition-colors duration-200 hover:text-[oklch(var(--foreground))]"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center gap-1.5 rounded-full bg-[oklch(var(--spark))] px-5 py-2 text-sm font-semibold text-[oklch(var(--ocean-950))] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_oklch(var(--spark)/0.4)] active:scale-95"
              >
                Get Started
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[oklch(var(--border)/0.5)] text-[oklch(var(--foreground)/0.7)] transition-colors duration-200 hover:border-[oklch(var(--border))] hover:text-[oklch(var(--foreground))] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen
            ? <X    className="h-4 w-4" />
            : <Menu className="h-4 w-4" />
          }
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        ref={mobileMenuRef}
        className="overflow-hidden md:hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="glass border-t border-white/[0.06] px-6 pb-6 pt-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-[oklch(var(--foreground)/0.7)] transition-colors duration-200 hover:bg-[oklch(var(--foreground)/0.05)] hover:text-[oklch(var(--foreground))]"
                >
                  {link.label}
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile auth CTAs */}
          <div className="mt-4 flex flex-col gap-3 border-t border-[oklch(var(--border)/0.3)] pt-4">
            {isLoggedIn ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(var(--primary))] to-[oklch(var(--spark)/0.6)] text-xs font-bold text-[oklch(var(--foreground))]">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[oklch(var(--foreground))]">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-[oklch(var(--muted-foreground))]">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-[oklch(var(--spark)/0.3)] bg-[oklch(var(--spark)/0.08)] px-4 py-2.5 text-sm font-semibold text-[oklch(var(--spark))]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </Link>

                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="flex items-center justify-center gap-2 rounded-full border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-[oklch(var(--border)/0.5)] px-4 py-2.5 text-center text-sm font-medium text-[oklch(var(--foreground)/0.7)] transition-colors hover:text-[oklch(var(--foreground))]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-[oklch(var(--spark))] px-4 py-2.5 text-center text-sm font-semibold text-[oklch(var(--ocean-950))]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}