import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ThemeToggle } from './ThemeToggle'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border)] z-30 flex items-center justify-between px-4">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)]"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <span className="font-bold text-lg text-[var(--text-primary)]">JobTrackr</span>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div 
          onClick={() => navigate('/profile')}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-transparent hover:border-[var(--accent)] transition-colors" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
