import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card } from '../ui/Card'
import { JobStatusBadge } from './JobStatusBadge'
import type { Job } from '../../types'

interface JobCardProps {
  job: Job
  onClick: () => void
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

const gradients = [
  'from-indigo-500 to-purple-600',
  'from-sky-500 to-cyan-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-fuchsia-600',
]

const statusBarColors: Record<string, string> = {
  saved: 'bg-indigo-500',
  applied: 'bg-sky-500',
  interviewing: 'bg-amber-500',
  offered: 'bg-emerald-500',
  rejected: 'bg-red-500',
}

export const JobCard = React.memo(function JobCard({ job, onClick }: JobCardProps) {
  const gradient = gradients[hashCode(job.company) % gradients.length]
  const initials = job.company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : ''

  const scoreColor =
    job.matchScore !== null && job.matchScore >= 70
      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      : job.matchScore !== null && job.matchScore >= 40
        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]'

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(99,102,241,0.12)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card variant="default" className="relative overflow-hidden">
        {/* Status bar */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl',
            statusBarColors[job.status]
          )}
        />

        <div className="pl-3">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div
              className={cn(
                'w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center',
                'text-white text-xs font-semibold flex-shrink-0',
                gradient
              )}
            >
              {initials}
            </div>
            {job.matchScore !== null && (
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-md border',
                  scoreColor
                )}
              >
                {job.matchScore}%
              </span>
            )}
          </div>

          {/* Middle */}
          <div className="mt-3">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">{job.company}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5 truncate">{job.role}</p>
            <div className="mt-2">
              <JobStatusBadge status={job.status} />
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <span className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
})
