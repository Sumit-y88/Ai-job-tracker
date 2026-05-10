import { useCallback } from 'react'
import api from '../lib/axios'
import type { Job, JobFilters } from '../types'

export function useJobs() {
  const fetchJobs = useCallback(
    async (filters?: Partial<JobFilters>): Promise<{ data: Job[] | null; error: string | null }> => {
      try {
        const params = new URLSearchParams()
        if (filters?.status && filters.status !== 'all') params.set('status', filters.status)
        if (filters?.search) params.set('search', filters.search)
        if (filters?.sort) params.set('sort', filters.sort)
        const res = await api.get(`/api/jobs?${params.toString()}`)
        return { data: res.data.data ?? res.data, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch jobs'
        return { data: null, error: message }
      }
    },
    []
  )

  const fetchJob = useCallback(
    async (id: string): Promise<{ data: Job | null; error: string | null }> => {
      try {
        const res = await api.get(`/api/jobs/${id}`)
        return { data: res.data.data ?? res.data, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch job'
        return { data: null, error: message }
      }
    },
    []
  )

  const createJob = useCallback(
    async (data: Partial<Job>): Promise<{ data: Job | null; error: string | null }> => {
      try {
        const res = await api.post('/api/jobs', data)
        return { data: res.data.data ?? res.data, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create job'
        return { data: null, error: message }
      }
    },
    []
  )

  const updateJob = useCallback(
    async (id: string, data: Partial<Job>): Promise<{ data: Job | null; error: string | null }> => {
      try {
        const res = await api.patch(`/api/jobs/${id}`, data)
        return { data: res.data.data ?? res.data, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update job'
        return { data: null, error: message }
      }
    },
    []
  )

  const deleteJob = useCallback(
    async (id: string): Promise<{ data: null; error: string | null }> => {
      try {
        await api.delete(`/api/jobs/${id}`)
        return { data: null, error: null }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to delete job'
        return { data: null, error: message }
      }
    },
    []
  )

  return { fetchJobs, fetchJob, createJob, updateJob, deleteJob }
}
