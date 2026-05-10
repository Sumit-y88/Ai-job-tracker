import React, { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  borderWidth?: number
}

export function AnimatedGradientBorder({
  children,
  className,
  animate = false,
  borderWidth = 1,
}: AnimatedGradientBorderProps) {
  const borderRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!animate || !borderRef.current) return

    const tick = () => {
      angleRef.current = (angleRef.current + 1) % 360
      if (borderRef.current) {
        borderRef.current.style.background = `conic-gradient(from ${angleRef.current}deg, transparent 0deg, var(--accent) 60deg, #8b5cf6 120deg, transparent 180deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  return (
    <div className={cn('relative rounded-2xl', className)}>
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-2xl"
        style={{
          padding: borderWidth,
          background: animate
            ? undefined
            : `conic-gradient(from 0deg, transparent 0deg, var(--accent) 60deg, #8b5cf6 120deg, transparent 180deg)`,
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative z-10 rounded-2xl bg-[var(--bg-surface)]">
        {children}
      </div>
    </div>
  )
}
