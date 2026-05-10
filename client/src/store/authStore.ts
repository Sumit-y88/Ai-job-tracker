import { create } from 'zustand'
import api from '../lib/axios'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { name?: string; resumeText?: string }) => Promise<void>
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    const { token, user } = res.data.data
    localStorage.setItem('jobtrackr-token', token)
    set({ user, token })
  },

  register: async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password })
    const { token, user } = res.data.data
    localStorage.setItem('jobtrackr-token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('jobtrackr-token')
    set({ user: null, token: null, isLoading: false })
  },

  updateProfile: async (data) => {
    const res = await api.patch('/api/auth/me', data)
    set({ user: res.data.user ?? res.data.data ?? res.data })
  },

  restoreSession: async () => {
    const token = localStorage.getItem('jobtrackr-token')
    if (!token) {
      set({ isLoading: false })
      return
    }
    try {
      const res = await api.get('/api/auth/me')
      set({ user: res.data.user ?? res.data.data ?? res.data, token, isLoading: false })
    } catch {
      localStorage.removeItem('jobtrackr-token')
      set({ user: null, token: null, isLoading: false })
    }
  },
}))
