// src/providers/GSAPProvider.tsx
'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


// ✅ Register at module load time — runs before ANY component mounts
// This guarantees ScrollTrigger is available when child useEffects fire
gsap.registerPlugin(ScrollTrigger)

export default function GSAPProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Refresh ScrollTrigger after fonts/images load
    // — prevents miscalculated trigger positions
    ScrollTrigger.refresh()

    return () => {
      // Kill all ScrollTrigger instances on unmount
      // Critical: prevents ghost triggers after hot-reload in dev
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return <>{children}</>
}