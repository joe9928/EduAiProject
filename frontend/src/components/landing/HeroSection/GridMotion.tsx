// src/components/landing/HeroSection/GridMotion.tsx
'use client'

import { useEffect, useRef, FC, ReactNode } from 'react'
import { gsap } from 'gsap'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface GridMotionProps {
  items?: (string | ReactNode)[]
  gradientColor?: string
}

const GridMotion: FC<GridMotionProps> = ({
  items = [],
  gradientColor = '#001B24',
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseXRef = useRef<number>(0)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const totalItems = 28
  const defaultItems = Array.from(
    { length: totalItems },
    (_, i) => `Item ${i + 1}`
  )
  const combinedItems =
    items.length > 0 ? items.slice(0, totalItems) : defaultItems

  useEffect(() => {
    // Initialize mouseX to center — avoids jump on first move
    mouseXRef.current = window.innerWidth / 2

    gsap.ticker.lagSmoothing(0)

    // --- Desktop: mouse-driven motion ---
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent): void => {
        mouseXRef.current = e.clientX
      }

      const updateMotion = (): void => {
        const maxMoveAmount = 300
        const baseDuration = 0.8
        const inertiaFactors = [0.6, 0.4, 0.3, 0.2]

        rowRefs.current.forEach((row, index) => {
          if (row) {
            const direction = index % 2 === 0 ? 1 : -1
            const moveAmount =
              ((mouseXRef.current / window.innerWidth) * maxMoveAmount -
                maxMoveAmount / 2) *
              direction

            gsap.to(row, {
              x: moveAmount,
              duration:
                baseDuration + inertiaFactors[index % inertiaFactors.length],
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }
        })
      }

      const ticker = gsap.ticker.add(updateMotion)
      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        ticker()
      }
    }

    // --- Mobile: auto-drift fallback ---
    // Each row drifts slowly back and forth — no mouse needed
    rowRefs.current.forEach((row, index) => {
      if (!row) return
      const direction = index % 2 === 0 ? 1 : -1
      gsap.to(row, {
        x: direction * 80,
        duration: 8 + index * 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })
  }, [isMobile])

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, ${gradientColor} 0%, #000810 100%)`,
        }}
      >
        {/* Animated grid — z-[2] keeps it behind content */}
        <div
          className="absolute inset-0 z-[2]"
          style={{ willChange: 'transform' }}
        >
          <div className="relative grid h-[150vh] w-[150vw] origin-center -translate-x-[25vw] -translate-y-[25vh] -rotate-[15deg] grid-cols-1 grid-rows-4 gap-4">
            {Array.from({ length: 4 }, (_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-7 gap-4"
                style={{ willChange: 'transform' }}
                ref={(el) => {
                  rowRefs.current[rowIndex] = el
                }}
              >
                {Array.from({ length: 7 }, (_, itemIndex) => {
                  const content = combinedItems[rowIndex * 7 + itemIndex]
                  return (
                    <div key={itemIndex} className="relative">
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-ocean-900 text-[1.5rem] text-white">
                        {typeof content === 'string' &&
                        content.startsWith('http') ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-500"
                            style={{ backgroundImage: `url(${content})` }}
                          />
                        ) : (
                          <div className="relative z-[1] p-4 text-center text-sm font-medium text-ice/60">
                            {content}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Gradient veil — creates depth and ensures text legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%, 
                rgba(0,14,20,0.55) 0%, 
                rgba(0,14,20,0.85) 60%, 
                rgba(0,8,16,0.97) 100%
              )
            `,
          }}
        />
      </section>
    </div>
  )
}

export default GridMotion