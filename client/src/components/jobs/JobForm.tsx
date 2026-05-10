import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { jobSchema, type JobFormData } from '../../lib/validators'
import type { Job, JobStatus } from '../../types'

interface JobFormProps {
  job?: Job
  onSubmit: (data: JobFormData) => Promise<void>
  isLoading?: boolean
}

const statusOptions = [
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
]

export function JobForm({ job, onSubmit, isLoading }: JobFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: job?.company || '',
      role: job?.role || '',
      jobDescription: job?.jobDescription || '',
      applicationUrl: job?.applicationUrl || '',
      appliedAt: job?.appliedAt || '',
      status: (job?.status || 'saved') as JobStatus,
      notes: job?.notes || '',
    },
  })

  const currentStatus = watch('status')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Company"
        placeholder="e.g., Google"
        error={errors.company?.message}
        {...register('company')}
      />
      <Input
        label="Role"
        placeholder="e.g., Senior Frontend Engineer"
        error={errors.role?.message}
        {...register('role')}
      />
      <Textarea
        label="Job Description"
        placeholder="Paste the full job description here..."
        rows={8}
        error={errors.jobDescription?.message}
        {...register('jobDescription')}
      />
      <Input
        label="Application URL"
        placeholder="https://..."
        error={errors.applicationUrl?.message}
        {...register('applicationUrl')}
      />
      <Input
        label="Applied Date"
        type="date"
        error={errors.appliedAt?.message}
        {...register('appliedAt')}
      />
      <Select
        label="Status"
        value={currentStatus}
        onValueChange={(v) => setValue('status', v as JobStatus)}
        options={statusOptions}
      />
      <Textarea
        label="Notes"
        placeholder="Any personal notes..."
        rows={3}
        {...register('notes')}
      />
      <Button type="submit" isLoading={isLoading} className="w-full mt-2">
        {job ? 'Update Application' : 'Add Application'}
      </Button>
    </form>
  )
}
