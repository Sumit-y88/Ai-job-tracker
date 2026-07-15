import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lightbulb, Upload, FileText, X, ChevronDown, ChevronUp, Check, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageLayout } from '../components/layout/PageLayout'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { ShimmerButton } from '../components/effects/ShimmerButton'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/Toast'
import { Spinner } from '../components/ui/Spinner'
import { profileSchema, type ProfileFormData } from '../lib/validators'
import api from '../lib/axios'

type UploadStatus = 'idle' | 'uploading' | 'saving' | 'done' | 'error'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const { toasts, showToast, dismiss } = useToast()
  const [resumeText, setResumeText] = useState(user?.resumeText || '')
  const [savingResume, setSavingResume] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasExistingResume = !!user?.resumeText?.trim()

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

  const handleSaveResume = async (text?: string) => {
    const textToSave = text ?? resumeText
    setSavingResume(true)
    try {
      await updateProfile({ resumeText: textToSave })
      showToast('Resume saved to profile!', 'success')
    } catch {
      showToast('Failed to save resume', 'error')
    }
    setSavingResume(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleUpload(files[0])
    }
    // Reset input so the same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await handleUpload(files[0])
    }
  }

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF file only', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB', 'error')
      return
    }

    setUploadedFileName(file.name)
    setUploadStatus('uploading')

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const res = await api.post('/api/auth/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.data.success && res.data.data.text) {
        const extractedText = res.data.data.text
        setResumeText(extractedText)

        // Auto-save to profile
        setUploadStatus('saving')
        await updateProfile({ resumeText: extractedText })

        setUploadStatus('done')
        showToast('Resume uploaded & saved to profile!', 'success')
      } else {
        setUploadStatus('error')
        showToast('Could not extract text from this PDF', 'error')
      }
    } catch (err: any) {
      console.error(err)
      setUploadStatus('error')
      showToast(err.response?.data?.message || 'Error processing PDF', 'error')
    }
  }

  const handleRemoveResume = async () => {
    setResumeText('')
    setUploadedFileName('')
    setUploadStatus('idle')
    setShowTextEditor(false)
    try {
      await updateProfile({ resumeText: '' })
      showToast('Resume removed from profile', 'success')
    } catch {
      showToast('Failed to remove resume', 'error')
    }
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  const statusLabel: Record<UploadStatus, string> = {
    idle: '',
    uploading: 'Extracting text from PDF...',
    saving: 'Saving to your profile...',
    done: 'Upload complete — resume saved!',
    error: 'Upload failed',
  }

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
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Resume</h2>
          {(hasExistingResume || resumeText) && (
            <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Resume Active
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Upload your resume as a PDF — text is extracted automatically and saved to power all AI features.
        </p>

        {/* Dropzone */}
        <input
          ref={fileInputRef}
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploadStatus === 'uploading' || uploadStatus === 'saving'}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (uploadStatus !== 'uploading' && uploadStatus !== 'saving') {
              fileInputRef.current?.click()
            }
          }}
          className={`
            relative border-2 border-dashed rounded-2xl text-center cursor-pointer
            transition-all duration-300 ease-out overflow-hidden
            ${uploadStatus === 'uploading' || uploadStatus === 'saving'
              ? 'pointer-events-none'
              : ''
            }
            ${isDragging
              ? 'border-[var(--accent)] bg-[var(--accent-subtle)] scale-[1.005]'
              : uploadStatus === 'done'
                ? 'border-emerald-400/50 bg-emerald-500/5'
                : uploadStatus === 'error'
                  ? 'border-red-400/50 bg-red-500/5'
                  : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-subtle)]'
            }
          `}
        >
          {/* Progress bar overlay */}
          {(uploadStatus === 'uploading' || uploadStatus === 'saving') && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--bg-surface-2)]">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: uploadStatus === 'uploading' ? '60%' : '95%',
                }}
                transition={{ duration: uploadStatus === 'uploading' ? 2 : 1, ease: 'easeOut' }}
              />
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-3 p-8">
            {uploadStatus === 'uploading' || uploadStatus === 'saving' ? (
              <>
                <Spinner size="lg" className="text-[var(--accent)]" />
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{statusLabel[uploadStatus]}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {uploadedFileName && `File: ${uploadedFileName}`}
                  </p>
                </div>
              </>
            ) : uploadStatus === 'done' ? (
              <>
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">Resume saved successfully!</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Drop a new PDF to replace, or <span className="text-[var(--accent)]">browse</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-[var(--accent-subtle)] text-[var(--accent)] rounded-full">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {hasExistingResume
                      ? <>Drop a new PDF to replace your resume, or <span className="text-[var(--accent)]">browse</span></>
                      : <>Drag and drop your PDF resume, or <span className="text-[var(--accent)]">browse</span></>
                    }
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">PDF only · Max 5 MB</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* File info bar — shows after upload or if resume exists */}
        <AnimatePresence>
          {(uploadedFileName || hasExistingResume) && uploadStatus !== 'uploading' && uploadStatus !== 'saving' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center justify-between p-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-[var(--accent-subtle)] rounded-lg flex-shrink-0">
                    <FileText className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {uploadedFileName || 'Resume on file'}
                    </p>
                    <p className="text-xs text-emerald-500 font-medium">Saved & active</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                    className="p-1.5 hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)] hover:text-[var(--accent)] rounded-lg transition-colors"
                    title="Replace resume"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveResume() }}
                    className="p-1.5 hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)] hover:text-[var(--danger)] rounded-lg transition-colors"
                    title="Remove resume"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsible text editor */}
        {resumeText && (
          <div className="mt-4 border border-[var(--border)] rounded-xl overflow-hidden">
            <button
              onClick={() => setShowTextEditor(!showTextEditor)}
              className="w-full flex items-center justify-between p-3.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{showTextEditor ? 'Hide extracted text' : 'View / edit extracted text'}</span>
              </div>
              {showTextEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showTextEditor && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)]">
                    <Textarea
                      rows={12}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="No resume text yet..."
                      showCount
                      maxLength={8000}
                      className="font-mono text-sm"
                    />
                    <div className="flex justify-end gap-3 mt-3">
                      <ShimmerButton
                        onClick={() => handleSaveResume()}
                        isLoading={savingResume}
                        loadingText="Saving..."
                      >
                        Save Changes
                      </ShimmerButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tip */}
        <div className="mt-4 bg-[var(--accent-subtle)] border border-[var(--accent-border)] rounded-xl p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--text-secondary)]">
            <strong>Tip:</strong> A well-formatted PDF resume gives the best AI results. Ensure it includes your skills, experience, and education for accurate match scoring and cover letter generation.
          </p>
        </div>
      </Card>
    </PageLayout>
  )
}
