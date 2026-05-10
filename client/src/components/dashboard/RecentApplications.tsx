import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card } from '../ui/Card'
import { JobStatusBadge } from '../jobs/JobStatusBadge'
import type { Job } from '../../types'

interface RecentApplicationsProps {
  jobs: Job[]
}

export function RecentApplications({ jobs }: RecentApplicationsProps) {
  const navigate = useNavigate()
  const recent = jobs.slice(0, 5)

  if (recent.length === 0) return null

  return (
    <Card variant="default" padding="md" className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Recent Applications
        </h3>
        <button
          onClick={() => navigate('/jobs')}
          className="text-xs text-[var(--accent)] font-medium hover:underline"
        >
          View all →
        </button>
      </div>
      <div className="space-y-1">
        {recent.map((job, i) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/jobs/${job._id}`)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer',
              'hover:bg-[var(--bg-surface-2)] transition-colors'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {job.company}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">{job.role}</p>
            </div>
            <JobStatusBadge status={job.status} />
            {job.matchScore !== null && (
              <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:block">
                {job.matchScore}%
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] hidden sm:flex">
              <Calendar className="w-3 h-3" />
              {new Date(job.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
