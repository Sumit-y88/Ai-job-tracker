import { useCallback, useState } from 'react'
import type { ToastItem } from '../types'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastItem['type'] = 'info') => {
      const id = `toast-${++toastId}`
      const toast: ToastItem = { id, message, type }
      setToasts((prev) => [...prev, toast])

      setTimeout(() => {
        dismiss(id)
      }, 3000)
    },
    [dismiss]
  )

  return { toasts, showToast, dismiss }
}
