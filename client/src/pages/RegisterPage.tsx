import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Briefcase } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { ShimmerButton } from '../components/effects/ShimmerButton'
import { Card } from '../components/ui/Card'
import { GridBackground } from '../components/effects/GridBackground'
import { AnimatedGradientBorder } from '../components/effects/AnimatedGradientBorder'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/Toast'
import { registerSchema, type RegisterFormData } from '../lib/validators'
import { GoogleButton } from '../components/auth/GoogleButton'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toasts, showToast, dismiss } = useToast()

  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      showToast('Google sign-up failed. Please try again.', 'error')
      window.history.replaceState({}, '', '/register')
    }
  }, [searchParams, showToast])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password)
      showToast('Account created!', 'success')
      navigate('/dashboard')
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed'
          : 'Registration failed'
      showToast(message, 'error')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg-base)] flex items-center justify-center p-4">
      <GridBackground />
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <AnimatedGradientBorder>
          <Card variant="default" padding="lg">
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center animate-float">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create account</h1>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Start tracking your job applications
              </p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={itemVariants}>
                <Input
                  label="Full name"
                  placeholder="John Doe"
                  leftIcon={User}
                  error={errors.name?.message}
                  {...register('name')}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={Mail}
                  error={errors.email?.message}
                  {...register('email')}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={Lock}
                  error={errors.password?.message}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  {...register('password')}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={Lock}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ShimmerButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Creating account..."
                  className="w-full"
                  icon={false}
                >
                  Create account
                </ShimmerButton>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--bg-surface)] px-3 text-[var(--text-muted)]">or</span>
              </div>
            </motion.div>

            {/* Google button */}
            <motion.div variants={itemVariants}>
              <GoogleButton label="Sign up with Google" />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-[var(--text-muted)] mt-6"
            >
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--accent)] font-medium hover:underline">
                Sign in
              </Link>
            </motion.p>
          </Card>
        </AnimatedGradientBorder>
      </motion.div>
    </div>
  )
}
