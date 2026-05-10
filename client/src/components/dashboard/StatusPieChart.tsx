import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card } from '../ui/Card'
import { cn } from '../../lib/cn'
import type { JobStatus } from '../../types'

interface StatusPieChartProps {
  data: Record<JobStatus, number>
}

const statusConfig: { key: JobStatus; label: string; color: string }[] = [
  { key: 'saved', label: 'Saved', color: '#6366f1' },
  { key: 'applied', label: 'Applied', color: '#0ea5e9' },
  { key: 'interviewing', label: 'Interviewing', color: '#f59e0b' },
  { key: 'offered', label: 'Offered', color: '#10b981' },
  { key: 'rejected', label: 'Rejected', color: '#ef4444' },
]

export function StatusPieChart({ data }: StatusPieChartProps) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  const chartData = statusConfig
    .map((s) => ({ name: s.label, value: data[s.key] || 0, color: s.color }))
    .filter((d) => d.value > 0)

  if (total === 0) {
    return (
      <Card variant="default" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Applications by Status
        </h3>
        <div className="flex items-center justify-center h-[200px] text-[var(--text-muted)] text-sm">
          No data yet
        </div>
      </Card>
    )
  }

  return (
    <Card variant="default" padding="md">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Applications by Status
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {statusConfig.map((s) => {
          const count = data[s.key] || 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={s.key} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-xs text-[var(--text-secondary)] flex-1">{s.label}</span>
              <span className="text-xs font-medium text-[var(--text-primary)] w-6 text-right">
                {count}
              </span>
              <div className="w-16 h-1.5 rounded-full bg-[var(--bg-surface-2)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
