import React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Check } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/cn'
import type { JobStatus } from '../../types'

const allStatuses: JobStatus[] = ['saved', 'applied', 'interviewing', 'offered', 'rejected']

const statusLabels: Record<JobStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offered: 'Offered',
  rejected: 'Rejected',
}

const dotColors: Record<JobStatus, string> = {
  saved: 'bg-indigo-500',
  applied: 'bg-sky-500',
  interviewing: 'bg-amber-500',
  offered: 'bg-emerald-500',
  rejected: 'bg-red-500',
}

interface JobStatusBadgeProps {
  status: JobStatus
  interactive?: boolean
  onStatusChange?: (status: JobStatus) => void
}

export function JobStatusBadge({ status, interactive = false, onStatusChange }: JobStatusBadgeProps) {
  if (!interactive) {
    return <Badge status={status} />
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center gap-1 cursor-pointer outline-none">
          <Badge status={status} />
          <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          className={cn(
            'z-50 min-w-[160px] overflow-hidden',
            'bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl',
            'shadow-[var(--shadow-md)] py-1',
            'animate-fade-in'
          )}
        >
          {allStatuses.map((s) => (
            <DropdownMenu.Item
              key={s}
              onClick={() => onStatusChange?.(s)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer',
                'hover:bg-[var(--bg-surface-2)] transition-colors outline-none mx-1 rounded-lg',
                s === status && 'text-[var(--accent)]'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', dotColors[s])} />
              <span className="flex-1">{statusLabels[s]}</span>
              {s === status && <Check className="w-3.5 h-3.5" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
