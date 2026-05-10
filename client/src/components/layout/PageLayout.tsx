import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function PageLayout({ children, title, subtitle, action }: PageLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Navbar onMenuClick={() => setMobileOpen(true)} />

      <main className="md:ml-60 pt-16 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto"
        >
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[var(--text-secondary)] text-sm mt-1">{subtitle}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>

          {children}
        </motion.div>
      </main>
    </div>
  )
}
