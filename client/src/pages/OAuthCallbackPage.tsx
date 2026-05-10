import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../hooks/useToast'
import { Loader2 } from 'lucide-react'
import type { User } from '../types'

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      showToast('Google sign-in failed. Please try again.', 'error')
      navigate('/login')
      return
    }

    const token = searchParams.get('token')
    const userStr = searchParams.get('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        localStorage.setItem('jobtrackr-token', token)
        useAuthStore.setState({ user, token })
        
        // Remove token and user from URL immediately
        window.history.replaceState({}, '', '/oauth/callback')
        
        showToast(`Welcome, ${user.name}!`, 'success')
        navigate('/dashboard')
      } catch (err) {
        console.error('Error parsing user data:', err)
        showToast('Authentication failed. Invalid data received.', 'error')
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate, showToast])

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin mb-4" />
      <p className="text-[var(--text-primary)] font-medium">Signing you in...</p>
    </div>
  )
}
