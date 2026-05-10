import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../lib/cn'

interface MatchScoreRingProps {
  score: number | null
  size?: number
}

export function MatchScoreRing({ score, size = 120 }: MatchScoreRingProps) {
  const r = size / 2 - 8
  const circumference = 2 * Math.PI * r
  const animated = useCountUp(score ?? 0, 1000)

  const color =
    score !== null && score >= 70
      ? '#10b981'
      : score !== null && score >= 40
        ? '#f59e0b'
        : score !== null
          ? '#ef4444'
          : '#64748b'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-surface-2)"
          strokeWidth={6}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset:
              score !== null ? circumference * (1 - score / 100) : circumference,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[var(--text-primary)]">
          {score !== null ? animated : '—'}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {score !== null ? 'match' : 'N/A'}
        </span>
      </div>
    </div>
  )
}
