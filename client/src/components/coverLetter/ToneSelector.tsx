import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import type { CoverLetterTone } from '../../types'

interface ToneSelectorProps {
  tone: CoverLetterTone
  onChange: (tone: CoverLetterTone) => void
}

const tones: { value: CoverLetterTone; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'assertive', label: 'Assertive' },
]

export function ToneSelector({ tone, onChange }: ToneSelectorProps) {
  return (
    <div className="bg-[var(--bg-surface-2)] rounded-xl p-1 inline-flex gap-1">
      {tones.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-lg z-10 transition-colors',
            tone === t.value
              ? 'text-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          )}
        >
          {tone === t.value && (
            <motion.div
              layoutId="tone-bg"
              className="absolute inset-0 bg-[var(--accent-subtle)] rounded-lg"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
