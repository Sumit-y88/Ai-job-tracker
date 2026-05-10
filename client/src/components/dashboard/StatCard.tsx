import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { Card } from '../ui/Card'
import { useCountUp } from '../../hooks/useCountUp'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  trend?: string
  suffix?: string
}

export const StatCard = React.memo(function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  suffix = '',
}: StatCardProps) {
  const animated = useCountUp(value, 800)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card variant="elevated" className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)] font-medium">{title}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">
              {animated}
              {suffix}
            </p>
            {trend && (
              <p className="text-xs text-emerald-500 font-medium mt-1">{trend}</p>
            )}
          </div>
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
})
