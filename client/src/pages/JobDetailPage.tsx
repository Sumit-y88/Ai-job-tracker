import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  ExternalLink,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Skeleton } from '../components/ui/Skeleton'
import { JobStatusBadge } from '../components/jobs/JobStatusBadge'
import { MatchScoreRing } from '../components/coverLetter/MatchScoreRing'
import { CoverLetterPanel } from '../components/coverLetter/CoverLetterPanel'
import { useJobs } from '../hooks/useJobs'
import { useCoverLetter } from '../hooks/useCoverLetter'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/Toast'
import { cn } from '../lib/cn'
import type { Job, CoverLetter } from '../types'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchJob, updateJob, deleteJob } = useJobs()
  const { fetchCoverLetter } = useCoverLetter()
  const { toasts, showToast, dismiss } = useToast()

  const [job, setJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)

  const debouncedNotes = useDebounce(notes, 1000)
  const prevNotes = useRef('')

  const loadJob = useCallback(async () => {
    if (!id) return
    const { data, error } = await fetchJob(id)
    if (error) {
      showToast(error, 'error')
      return
    }
    if (data) {
      setJob(data)
      setNotes(data.notes || '')
      prevNotes.current = data.notes || ''
    }
    setLoading(false)
  }, [id, fetchJob, showToast])

  const loadCoverLetter = useCallback(async () => {
    if (!id) return
    const { data } = await fetchCoverLetter(id)
    if (data) setCoverLetter(data)
  }, [id, fetchCoverLetter])

  useEffect(() => {
    loadJob()
    loadCoverLetter()
  }, [loadJob, loadCoverLetter])

  // Auto-save notes
  useEffect(() => {
    if (!id || !job || debouncedNotes === prevNotes.current) return
    prevNotes.current = debouncedNotes
    updateJob(id, { notes: debouncedNotes }).then(({ error }) => {
      if (error) return
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }, [debouncedNotes, id, job, updateJob])

  const handleStatusChange = async (status: Job['status']) => {
    if (!id) return
    const { data, error } = await updateJob(id, { status })
    if (error) {
      showToast(error, 'error')
      return
    }
    if (data) setJob(data)
    showToast('Status updated', 'success')
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    const { error } = await deleteJob(id)
    setDeleting(false)
    if (error) {
      showToast(error, 'error')
      return
    }
    showToast('Application deleted', 'success')
    navigate('/jobs')
  }

  if (loading) {
    return (
      <PageLayout title="Loading...">
        <div className="space-y-4">
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={20} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton variant="card" height={200} />
              <Skeleton variant="card" height={160} />
            </div>
            <div className="lg:col-span-2">
              <Skeleton variant="card" height={400} />
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!job) {
    return (
      <PageLayout title="Not Found">
        <p className="text-[var(--text-muted)]">Job application not found.</p>
        <Button variant="secondary" onClick={() => navigate('/jobs')} className="mt-4">
          Back to Jobs
        </Button>
      </PageLayout>
    )
  }

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <PageLayout title={job.company} subtitle={job.role}>
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6 -mt-4">
        <Link to="/jobs" className="hover:text-[var(--accent)] transition-colors">
          My Jobs
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--text-primary)]">{job.company}</span>
      </div>

      {/* Header info row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <JobStatusBadge
          status={job.status}
          interactive
          onStatusChange={handleStatusChange}
        />
        <span className="text-sm text-[var(--text-muted)]">{formattedDate}</span>
        {job.applicationUrl && (
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Application URL
          </a>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-6">
          {/* Match Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="default" padding="md">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                Match Analysis
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <MatchScoreRing score={job.matchScore} />
                <div className="flex-1 space-y-3">
                  {job.matchDetails?.strengths?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                        Strengths
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.matchDetails.strengths.map((s, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-xs rounded-lg border border-emerald-500/20"
                          >
                            <CheckCircle className="w-3 h-3" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {job.matchDetails?.gaps?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                        Gaps
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.matchDetails.gaps.map((g, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-500 text-xs rounded-lg border border-red-500/20"
                          >
                            <XCircle className="w-3 h-3" /> {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!job.matchScore && (
                    <p className="text-sm text-[var(--text-muted)]">
                      Analyzing match...
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Job Description */}
          <Card variant="default" padding="md">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">
              Job Description
            </h3>
            <div
              className={cn(
                'relative text-sm text-[var(--text-secondary)] whitespace-pre-wrap transition-all duration-300',
                !showFullDesc && 'max-h-24 overflow-hidden'
              )}
            >
              {job.jobDescription}
              {!showFullDesc && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--bg-surface)] to-transparent" />
              )}
            </div>
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="flex items-center gap-1 text-sm text-[var(--accent)] mt-2 font-medium hover:underline"
            >
              {showFullDesc ? 'Show less' : 'Show more'}
              <motion.div animate={{ rotate: showFullDesc ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </Card>

          {/* Notes */}
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[var(--text-primary)]">Notes</h3>
              {saved && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-500 font-medium flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" /> Saved
                </motion.span>
              )}
            </div>
            <textarea
              className={cn(
                'w-full rounded-xl px-4 py-3',
                'bg-[var(--bg-surface-2)] border border-[var(--border)]',
                'text-[var(--text-primary)] text-sm',
                'focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20',
                'transition-all duration-200 resize-none'
              )}
              rows={4}
              placeholder="Add personal notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>

          {/* Danger Zone */}
          <div className="border-t border-[var(--border)] pt-6">
            <Button
              variant="danger"
              leftIcon={Trash2}
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Application
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          <CoverLetterPanel
            jobId={job._id}
            coverLetter={coverLetter}
            onUpdate={loadCoverLetter}
            showToast={showToast}
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Application"
        description="Are you sure? This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--text-secondary)]">
          This will permanently delete the application for{' '}
          <strong>{job.company} — {job.role}</strong> and any associated cover letters.
        </p>
      </Modal>
    </PageLayout>
  )
}
