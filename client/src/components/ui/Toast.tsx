import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ToastItem } from '../../types'

interface ToastContainerProps {
  toasts: ToastItem[]
  dismiss: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const colorMap = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-[var(--accent)]',
}

export function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={cn(
                'pointer-events-auto',
                'bg-[var(--bg-surface)] border border-[var(--border)]',
                'rounded-xl shadow-[var(--shadow-md)]',
                'px-4 py-3 flex items-start gap-3',
                'min-w-[300px] max-w-[420px]',
                'relative overflow-hidden'
              )}
            >
              <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', colorMap[toast.type])} />
              <p className="text-sm text-[var(--text-primary)] flex-1">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className={cn(
                  'absolute bottom-0 left-0 right-0 h-0.5 origin-left',
                  toast.type === 'success' && 'bg-emerald-500',
                  toast.type === 'error' && 'bg-red-500',
                  toast.type === 'info' && 'bg-[var(--accent)]'
                )}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
