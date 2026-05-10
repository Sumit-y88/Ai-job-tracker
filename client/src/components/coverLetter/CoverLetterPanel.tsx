import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Copy, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { ShimmerButton } from '../effects/ShimmerButton'
import { AnimatedGradientBorder } from '../effects/AnimatedGradientBorder'
import { ToneSelector } from './ToneSelector'
import { useTypewriter } from '../../hooks/useTypewriter'
import { useCoverLetter } from '../../hooks/useCoverLetter'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/cn'
import type { CoverLetter, CoverLetterTone } from '../../types'

interface CoverLetterPanelProps {
  jobId: string
  coverLetter: CoverLetter | null
  onUpdate: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

export function CoverLetterPanel({ jobId, coverLetter, onUpdate, showToast }: CoverLetterPanelProps) {
  const [tone, setTone] = useState<CoverLetterTone>('formal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(coverLetter?.content || '')
  const { generateCoverLetter, finalizeCoverLetter } = useCoverLetter()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const { displayText, isDone } = useTypewriter(
    isGenerating ? '' : generatedContent,
    35
  )

  const handleGenerate = async () => {
    setIsGenerating(true)
    const { data, error } = await generateCoverLetter(jobId, tone)
    setIsGenerating(false)
    if (error) {
      showToast(error, 'error')
      return
    }
    if (data) {
      setGeneratedContent(data.content)
      onUpdate()
      showToast('Cover letter generated!', 'success')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    showToast('Copied to clipboard!', 'success')
  }

  const handleFinalize = async () => {
    if (!coverLetter) return
    const { error } = await finalizeCoverLetter(coverLetter._id)
    if (error) {
      showToast(error, 'error')
      return
    }
    onUpdate()
    showToast('Cover letter finalized!', 'success')
  }

  const hasResume = user?.resumeText && user.resumeText.trim().length > 0

  const content = (
    <Card variant="glass" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[var(--accent)]" />
        <h3 className="font-semibold text-[var(--text-primary)]">AI Cover Letter</h3>
      </div>

      {!hasResume && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-500 font-medium">Resume required</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Add your resume in Profile to enable AI cover letter generation.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-[var(--accent)] font-medium mt-2 hover:underline"
            >
              Go to Profile →
            </button>
          </div>
        </div>
      )}

      <ToneSelector tone={tone} onChange={setTone} />

      <ShimmerButton
        onClick={handleGenerate}
        isLoading={isGenerating}
        loadingText="Generating..."
        disabled={!hasResume}
        className="w-full mt-4"
      >
        Generate Cover Letter
      </ShimmerButton>

      {isGenerating && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Crafting your personalized cover letter...
          </p>
        </div>
      )}

      {generatedContent && !isGenerating && (
        <div className="mt-4">
          <textarea
            className={cn(
              'w-full rounded-xl px-4 py-3',
              'bg-[var(--bg-surface-2)] border border-[var(--border)]',
              'text-[var(--text-primary)] font-mono text-sm',
              'focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20',
              'transition-all duration-200 resize-none'
            )}
            rows={14}
            value={isDone ? generatedContent : displayText}
            onChange={(e) => {
              if (isDone) setGeneratedContent(e.target.value)
            }}
            readOnly={!isDone}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--text-muted)]">
              {generatedContent.split(/\s+/).length} words · {generatedContent.length} chars
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy} leftIcon={Copy}>
                Copy
              </Button>
              {coverLetter?.isFinal ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium px-2 py-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Finalized
                </span>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleFinalize}
                  leftIcon={CheckCircle}
                >
                  Finalize
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )

  return isGenerating ? (
    <AnimatedGradientBorder animate>{content}</AnimatedGradientBorder>
  ) : (
    content
  )
}
