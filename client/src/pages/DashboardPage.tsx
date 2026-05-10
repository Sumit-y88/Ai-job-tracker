import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, CalendarCheck, Trophy, TrendingDown } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { StatCard } from '../components/dashboard/StatCard'
import { StatusPieChart } from '../components/dashboard/StatusPieChart'
import { ApplicationTimeline } from '../components/dashboard/ApplicationTimeline'
import { RecentApplications } from '../components/dashboard/RecentApplications'
import { ShimmerButton } from '../components/effects/ShimmerButton'
import { Skeleton } from '../components/ui/Skeleton'
import { useJobs } from '../hooks/useJobs'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/Toast'
import type { Job, JobStatus } from '../types'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)
  const { fetchJobs } = useJobs()
  const navigate = useNavigate()
  const { toasts, showToast, dismiss } = useToast()

  useEffect(() => {
    async function load() {
      const { data, error } = await fetchJobs()
      if (error) showToast(error, 'error')
      if (data) setJobs(data)
      setLoading(false)
    }
    load()
  }, [fetchJobs, showToast])

  const stats = useMemo(() => {
    const total = jobs.length
    const interviews = jobs.filter((j) => j.status === 'interviewing').length
    const offers = jobs.filter((j) => j.status === 'offered').length
    const rejected = jobs.filter((j) => j.status === 'rejected').length
    const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0

    const byStatus: Record<JobStatus, number> = {
      saved: jobs.filter((j) => j.status === 'saved').length,
      applied: jobs.filter((j) => j.status === 'applied').length,
      interviewing: interviews,
      offered: offers,
      rejected: rejected,
    }

    // Weekly data (last 4 weeks)
    const now = new Date()
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - (3 - i) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      const count = jobs.filter((j) => {
        const d = new Date(j.createdAt)
        return d >= weekStart && d < weekEnd
      }).length
      return {
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      }
    })

    return { total, interviews, offers, rejectionRate, byStatus, weeklyData }
  }, [jobs])

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (loading) {
    return (
      <PageLayout title="Dashboard" subtitle={dateStr}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" height={130} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton variant="card" height={320} />
          <Skeleton variant="card" height={320} />
        </div>
      </PageLayout>
    )
  }

  // Empty state
  if (jobs.length === 0) {
    return (
      <PageLayout title="Dashboard" subtitle={dateStr}>
        <ToastContainer toasts={toasts} dismiss={dismiss} />
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-2)] flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            No applications yet
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1 mb-6">
            Start tracking your job search
          </p>
          <ShimmerButton onClick={() => navigate('/jobs')}>
            Add your first application
          </ShimmerButton>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={`${getGreeting()}, ${user?.name?.split(' ')[0] ?? 'there'} 👋`}
      subtitle={dateStr}
    >
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* Stat Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Applications"
          value={stats.total}
          icon={Briefcase}
          iconBg="bg-indigo-500/10"
          iconColor="text-indigo-500"
        />
        <StatCard
          title="Interviews"
          value={stats.interviews}
          icon={CalendarCheck}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-500"
        />
        <StatCard
          title="Offers"
          value={stats.offers}
          icon={Trophy}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Rejection Rate"
          value={stats.rejectionRate}
          icon={TrendingDown}
          iconBg="bg-red-500/10"
          iconColor="text-red-500"
          suffix="%"
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <StatusPieChart data={stats.byStatus} />
        <ApplicationTimeline data={stats.weeklyData} />
      </div>

      {/* Recent Applications */}
      <RecentApplications jobs={jobs} />
    </PageLayout>
  )
}
