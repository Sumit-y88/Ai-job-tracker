import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Briefcase } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { JobCard } from '../components/jobs/JobCard'
import { JobSkeleton } from '../components/jobs/JobSkeleton'
import { JobFilters } from '../components/jobs/JobFilters'
import { JobForm } from '../components/jobs/JobForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { JobStatusBadge } from '../components/jobs/JobStatusBadge'
import { useJobs } from '../hooks/useJobs'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/Toast'
import type { Job, JobFilters as JobFiltersType } from '../types'
import type { JobFormData } from '../lib/validators'
import { cn } from '../lib/cn'

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<JobFiltersType>({
    search: '',
    status: 'all',
    sort: 'newest',
  })

  const { fetchJobs, createJob } = useJobs()
  const navigate = useNavigate()
  const { toasts, showToast, dismiss } = useToast()
  const debouncedSearch = useDebounce(filters.search, 400)

  const loadJobs = useCallback(async () => {
    const { data, error } = await fetchJobs()
    if (error) showToast(error, 'error')
    if (data) setJobs(data)
    setLoading(false)
  }, [fetchJobs, showToast])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const filtered = useMemo(() => {
    let result = [...jobs]

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (j) =>
          j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q)
      )
    }

    // Status
    if (filters.status !== 'all') {
      result = result.filter((j) => j.status === filters.status)
    }

    // Sort
    if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (filters.sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (filters.sort === 'highest-match') {
      result.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    }

    return result
  }, [jobs, debouncedSearch, filters.status, filters.sort])

  const handleCreate = async (data: JobFormData) => {
    setSubmitting(true)
    const { error } = await createJob(data as Partial<Job>)
    setSubmitting(false)
    if (error) {
      showToast(error, 'error')
      return
    }
    showToast('Application added!', 'success')
    setModalOpen(false)
    loadJobs()
  }

  const handleFilterChange = useCallback((update: Partial<JobFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...update }))
  }, [])

  return (
    <PageLayout
      title="My Applications"
      subtitle={`${jobs.length} application${jobs.length !== 1 ? 's' : ''} tracked`}
      action={
        <Button leftIcon={Plus} onClick={() => setModalOpen(true)}>
          Add Application
        </Button>
      }
    >
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* Filters */}
      <div className="mb-6">
        <JobFilters
          filters={filters}
          onChange={handleFilterChange}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty after filter */}
      {!loading && filtered.length === 0 && jobs.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-16 text-center">
          <p className="text-[var(--text-muted)] text-sm">
            No applications match your filters
          </p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() =>
              setFilters({ search: '', status: 'all', sort: 'newest' })
            }
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-2)] flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            No applications yet
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1 mb-6">
            Click "Add Application" to get started
          </p>
        </div>
      )}

      {/* Grid view */}
      {!loading && filtered.length > 0 && viewMode === 'grid' && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((job) => (
            <motion.div key={job._id} variants={itemVariants}>
              <JobCard job={job} onClick={() => navigate(`/jobs/${job._id}`)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* List view */}
      {!loading && filtered.length > 0 && viewMode === 'list' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-[var(--border)] text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            <div className="col-span-4">Company / Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Match</div>
            <div className="col-span-2">Applied</div>
            <div className="col-span-2">Actions</div>
          </div>
          {filtered.map((job, i) => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className={cn(
                'grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 cursor-pointer',
                'hover:bg-[var(--bg-surface-2)] transition-colors',
                i % 2 === 1 && 'bg-[var(--bg-subtle)]'
              )}
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {job.company.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {job.company}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{job.role}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <JobStatusBadge status={job.status} />
              </div>
              <div className="col-span-2 flex items-center text-sm text-[var(--text-secondary)]">
                {job.matchScore !== null ? `${job.matchScore}%` : '—'}
              </div>
              <div className="col-span-2 flex items-center text-xs text-[var(--text-muted)]">
                {new Date(job.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-xs text-[var(--accent)] font-medium">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Job Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Add New Application"
        description="Fill in the details of your job application."
      >
        <JobForm onSubmit={handleCreate} isLoading={submitting} />
      </Modal>
    </PageLayout>
  )
}
