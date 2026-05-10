import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        bg: {
          base: 'var(--bg-base)',
          subtle: 'var(--bg-subtle)',
          surface: 'var(--bg-surface)',
          2: 'var(--bg-surface-2)',
          3: 'var(--bg-surface-3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
          border: 'var(--accent-border)',
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'border-spin': 'borderSpin 4s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'count-up': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        borderSpin: {
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          from: { boxShadow: '0 0 5px var(--accent)' },
          to: { boxShadow: '0 0 25px var(--accent), 0 0 60px var(--accent-subtle)' },
        },
      },
    },
  },
  safelist: [
    'border-indigo-500', 'border-sky-500', 'border-amber-500',
    'border-emerald-500', 'border-red-500',
    'text-indigo-500', 'text-sky-500', 'text-amber-500',
    'text-emerald-500', 'text-red-500',
    'bg-indigo-500/10', 'bg-sky-500/10', 'bg-amber-500/10',
    'bg-emerald-500/10', 'bg-red-500/10',
  ],
  plugins: [],
} satisfies Config
