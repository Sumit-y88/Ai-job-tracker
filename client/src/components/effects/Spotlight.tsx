import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

interface SpotlightProps {
  children: React.ReactNode
  className?: string
}

export function Spotlight({ children, className }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    el.addEventListener('mousemove', handleMove)
    return () => el.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, var(--accent-subtle), transparent 60%)`,
          opacity: 0.6,
        }}
      />
      {children}
    </div>
  )
}
