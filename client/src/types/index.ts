export type JobStatus =
  | 'saved'
  | 'applied'
  | 'interviewing'
  | 'offered'
  | 'rejected'

export type CoverLetterTone = 'formal' | 'friendly' | 'assertive'

export interface User {
  _id: string
  name: string
  email: string
  resumeText: string
  avatar?: string
  authProvider?: 'local' | 'google'
  createdAt: string
}

export interface MatchDetails {
  strengths: string[]
  gaps: string[]
}

export interface Job {
  _id: string
  userId: string
  company: string
  role: string
  status: JobStatus
  jobDescription: string
  matchScore: number | null
  matchDetails: MatchDetails
  notes: string
  applicationUrl: string
  appliedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CoverLetter {
  _id: string
  jobId: string
  content: string
  tone: CoverLetterTone
  generatedAt: string
  isFinal: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface JobFilters {
  search: string
  status: JobStatus | 'all'
  sort: 'newest' | 'oldest' | 'highest-match'
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export interface DashboardStats {
  total: number
  interviews: number
  offers: number
  rejectionRate: number
  byStatus: Record<JobStatus, number>
  weeklyData: { week: string; count: number }[]
}
