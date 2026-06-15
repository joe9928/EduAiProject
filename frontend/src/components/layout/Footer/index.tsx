// src/components/layout/Footer/index.tsx
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import {
  TwitterIcon,
  LinkedInIcon,
  GitHubIcon,
  YouTubeIcon,
} from "@/components/icons/SocialIcons"

type FooterLink = {
  label: string
  href: string
  badge?: string
}

type SocialLink = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
  label: string
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Platform: [
    { label: 'Courses', href: '#courses' },
    { label: 'Features', href: '#features' },
    { label: 'EduAI', href: '#eduai' },
    { label: 'Pricing', href: '#pricing' },
   
  ],
  Resources: [
    { label: 'Documentation', href: '#docs' },
    { label: 'Blog', href: '#blog' },
    { label: 'Community', href: '#community' },
    { label: 'About', href: '#about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
  ],
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: TwitterIcon,
    href: '#',
    label: 'Twitter',
  },
  {
    icon: LinkedInIcon,
    href: '#',
    label: 'LinkedIn',
  },
  {
    icon: GitHubIcon,
    href: '#',
    label: 'GitHub',
  },
  {
    icon: YouTubeIcon,
    href: '#',
    label: 'YouTube',
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#000810]">
      <div className="via-ocean-600/40 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_2fr_1fr]">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-2.5"
            >
              <div className="from-spark/80 to-ocean-500 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-[0_0_16px_rgba(0,212,255,0.25)] transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(0,212,255,0.4)]">
                <GraduationCap className="text-ocean-950 h-4 w-4" />
              </div>
              <span className="font-display text-ice text-lg font-bold tracking-tight">
                Edu<span className="text-spark">Learn</span>
              </span>
            </Link>

            <p className="text-ice/40 max-w-xs text-sm leading-relaxed">
              AI-powered adaptive learning that meets every student where they
              are — and takes them further than they thought possible.
            </p>

            {/* Social icons — no destructuring in map */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-ice/40 hover:border-spark/40 hover:text-spark flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-all duration-200"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Column 2 — Link groups */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map((entry) => {
              const group = entry[0]
              const links = entry[1]
              return (
                <div key={group}>
                  <p className="text-ice/50 mb-4 text-xs font-semibold tracking-widest uppercase">
                    {group}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-ice/40 hover:text-ice inline-flex items-center gap-2 text-sm transition-colors duration-200"
                        >
                          {link.label}
                          {link.badge && (
                            <span className="bg-spark/15 text-spark rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Column 3 — Newsletter */}
          <div>
            <p className="text-ice/50 mb-4 text-xs font-semibold tracking-widest uppercase">
              Stay Updated
            </p>
            <p className="text-ice/40 mb-4 text-sm leading-relaxed">
              Get learning tips and platform updates in your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="text-ice placeholder-ice/25 focus:border-spark/40 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition-colors duration-200 outline-none focus:bg-white/[0.07]"
              />
              <button className="bg-ocean-700 text-ice hover:bg-ocean-600 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,78,100,0.4)] active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-ice/25 text-xs">
            © {new Date().getFullYear()} EduLearn. All rights reserved.
          </p>
          <p className="text-ice/25 text-xs">
            Built with <span className="text-spark/60">♥</span> for learners
            everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
