import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={cn(
                  'fixed top-1/2 left-1/2 z-50',
                  'w-full max-w-lg',
                  'bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl',
                  'shadow-[var(--shadow-lg)] p-6',
                  'focus:outline-none',
                  className
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  {title && (
                    <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">
                      {title}
                    </Dialog.Title>
                  )}
                  <Dialog.Close asChild>
                    <button
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        'hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)]',
                        'hover:text-[var(--text-primary)]'
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>
                {description && (
                  <Dialog.Description className="text-sm text-[var(--text-secondary)] mb-4">
                    {description}
                  </Dialog.Description>
                )}
                <div>{children}</div>
                {footer && (
                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
                    {footer}
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
