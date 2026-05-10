import { Search, LayoutGrid, List } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { cn } from '../../lib/cn'
import type { JobFilters as JobFiltersType, JobStatus } from '../../types'

interface JobFiltersProps {
  filters: JobFiltersType
  onChange: (filters: Partial<JobFiltersType>) => void
  viewMode: 'grid' | 'list'
  onViewChange: (mode: 'grid' | 'list') => void
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest-match', label: 'Highest Match' },
]

export function JobFilters({ filters, onChange, viewMode, onViewChange }: JobFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
      <div className="flex-1 w-full sm:max-w-xs">
        <Input
          placeholder="Search company or role..."
          leftIcon={Search}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          value={filters.status}
          onValueChange={(v) => onChange({ status: v as JobStatus | 'all' })}
          options={statusOptions}
          placeholder="Status"
        />
      </div>
      <div className="w-full sm:w-44">
        <Select
          value={filters.sort}
          onValueChange={(v) => onChange({ sort: v as JobFiltersType['sort'] })}
          options={sortOptions}
          placeholder="Sort by"
        />
      </div>
      <div className="flex items-center gap-1 bg-[var(--bg-surface-2)] rounded-lg p-1">
        <button
          onClick={() => onViewChange('grid')}
          className={cn(
            'p-2 rounded-md transition-colors',
            viewMode === 'grid'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          )}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={cn(
            'p-2 rounded-md transition-colors',
            viewMode === 'list'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          )}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
