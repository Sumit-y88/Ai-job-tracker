import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/cn'
import { Sparkles } from 'lucide-react'
import { Spinner } from '../ui/Spinner'

interface ShimmerButtonProps extends HTMLMotionProps<'button'> {
  isLoading?: boolean
  loadingText?: string
  icon?: boolean
}

export function ShimmerButton({
  children,
  className,
  isLoading = false,
  loadingText = 'Loading...',
  icon = true,
  disabled,
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'h-11 px-6 rounded-xl font-semibold text-white',
        'bg-gradient-to-r from-[var(--accent)] via-purple-500 to-[var(--accent)]',
        'bg-[length:200%_200%] animate-shimmer',
        'shadow-lg shadow-[var(--accent)]/25',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <Sparkles className="w-4 h-4" />}
          {children}
        </>
      )}
    </motion.button>
  )
}
