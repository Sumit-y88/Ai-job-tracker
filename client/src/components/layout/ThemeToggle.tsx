import { AnimatePresence, motion } from 'framer-motion'
import { useThemeStore } from '../../store/themeStore'
import { Sun, Moon } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Tooltip content={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </Tooltip>
  )
}
