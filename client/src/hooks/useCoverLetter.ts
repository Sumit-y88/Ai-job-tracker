import { useCallback } from 'react'
import api from '../lib/axios'
import type { CoverLetter, CoverLetterTone } from '../types'

export function useCoverLetter() {
  const generateCoverLetter = useCallback(
    async (
      jobId: string,
      tone: CoverLetterTone
    ): Promise<{ data: CoverLetter | null; error: string | null }> => {
      try {
        const res = await api.post('/api/cover-letters/generate', { jobId, tone })
        return { data: res.data.data ?? res.data, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to generate cover letter'
        return { data: null, error: message }
      }
    },
    []
  )

  const fetchCoverLetter = useCallback(
    async (jobId: string): Promise<{ data: CoverLetter | null; error: string | null }> => {
      try {
        const res = await api.get(`/api/cover-letters/job/${jobId}`)
        return { data: res.data.data ?? res.data, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch cover letter'
        return { data: null, error: message }
      }
    },
    []
  )

  const finalizeCoverLetter = useCallback(
    async (id: string): Promise<{ data: CoverLetter | null; error: string | null }> => {
      try {
        const res = await api.patch(`/api/cover-letters/${id}/finalize`)
        return { data: res.data.data ?? res.data, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to finalize cover letter'
        return { data: null, error: message }
      }
    },
    []
  )

  const deleteCoverLetter = useCallback(
    async (id: string): Promise<{ data: null; error: string | null }> => {
      try {
        await api.delete(`/api/cover-letters/${id}`)
        return { data: null, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to delete cover letter'
        return { data: null, error: message }
      }
    },
    []
  )

  return { generateCoverLetter, fetchCoverLetter, finalizeCoverLetter, deleteCoverLetter }
}
