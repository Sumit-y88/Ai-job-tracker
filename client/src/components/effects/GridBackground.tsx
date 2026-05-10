import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { useThemeStore } from '../../store/themeStore'

export function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const strokeColor = theme === 'dark' ? '#1e1e35' : '#e2e8f0'
  const strokeOpacity = theme === 'dark' ? 0.8 : 0.6
  const spotlightColor =
    theme === 'dark' ? 'rgba(129,140,248,0.08)' : 'rgba(99,102,241,0.06)'

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 pointer-events-none overflow-hidden')}
    >
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke={strokeColor}
              strokeOpacity={strokeOpacity}
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, var(--bg-base) 70%)`,
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
    </div>
  )
}
