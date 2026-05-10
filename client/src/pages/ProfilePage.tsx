import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lightbulb } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { ShimmerButton } from '../components/effects/ShimmerButton'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/Toast'
import { profileSchema, type ProfileFormData } from '../lib/validators'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const { toasts, showToast, dismiss } = useToast()
  const [resumeText, setResumeText] = useState(user?.resumeText || '')
  const [savingResume, setSavingResume] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  })

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      showToast('Profile updated!', 'success')
    } catch {
      showToast('Failed to update profile', 'error')
    }
  }

  const handleSaveResume = async () => {
    setSavingResume(true)
    try {
      await updateProfile({ resumeText })
      showToast('Resume saved!', 'success')
    } catch {
      showToast('Failed to save resume', 'error')
    }
    setSavingResume(false)
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <PageLayout title="Profile">
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* Account Details */}
      <Card variant="default" padding="md">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
          Account Details
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">{user?.name}</p>
            <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4 max-w-md">
          <Input
            label="Name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            value={user?.email || ''}
            readOnly
            className="opacity-60 cursor-not-allowed"
          />
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Resume */}
      <Card variant="default" padding="md" className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Resume</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">
          The AI uses this to generate cover letters and calculate match scores.
        </p>
        <Textarea
          rows={14}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your full resume text here..."
          showCount
          maxLength={8000}
          className="font-mono text-sm"
        />
        <ShimmerButton
          onClick={handleSaveResume}
          isLoading={savingResume}
          loadingText="Saving..."
          className="w-full mt-4"
        >
          Save Resume
        </ShimmerButton>

        {/* Tip */}
        <div className="mt-4 bg-[var(--accent-subtle)] border border-[var(--accent-border)] rounded-xl p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--text-secondary)]">
            <strong>Tip:</strong> Include your full work history, skills, education, and key
            achievements for the most accurate AI matching.
          </p>
        </div>
      </Card>
    </PageLayout>
  )
}
