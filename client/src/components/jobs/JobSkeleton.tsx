import { Skeleton } from '../ui/Skeleton'
import { Card } from '../ui/Card'

export function JobSkeleton() {
  return (
    <Card variant="default" className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-[var(--bg-surface-3)]" />
      <div className="pl-3 space-y-3">
        <div className="flex items-start justify-between">
          <Skeleton variant="rect" width={36} height={36} className="rounded-lg" />
          <Skeleton variant="text" width={40} height={20} />
        </div>
        <div>
          <Skeleton variant="text" width="70%" height={18} />
          <Skeleton variant="text" width="50%" height={14} className="mt-1.5" />
          <Skeleton variant="text" width={80} height={24} className="mt-2 rounded-lg" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <Skeleton variant="text" width={70} height={14} />
          <Skeleton variant="text" width={40} height={14} />
        </div>
      </div>
    </Card>
  )
}
