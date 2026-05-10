import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import type { JobStatus } from '../../types'

type BadgeVariant = JobStatus | 'default'

const statusConfig: Record<
  JobStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  saved: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-500',
    border: 'border-indigo-500/20',
    dot: 'bg-indigo-500',
  },
  applied: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-500',
    border: 'border-sky-500/20',
    dot: 'bg-sky-500',
  },
  interviewing: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500',
  },
  offered: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  rejected: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/20',
    dot: 'bg-red-500',
  },
}

interface BadgeProps {
  status?: JobStatus
  variant?: BadgeVariant
  children?: React.ReactNode
  className?: string
}

export function Badge({ status, children, className }: BadgeProps) {
  const config = status ? statusConfig[status] : null
  const label = children || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '')

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status || 'default'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border',
          config
            ? cn(config.bg, config.text, config.border)
            : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border-[var(--border)]',
          className
        )}
      >
        {config && <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />}
        {label}
      </motion.span>
    </AnimatePresence>
  )
}
