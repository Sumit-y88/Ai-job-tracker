import React from 'react'
import { cn } from '../../lib/cn'

type CardVariant = 'default' | 'elevated' | 'ghost' | 'glass'
type CardPadding = 'sm' | 'md' | 'lg'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)]',
  elevated:
    'bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300',
  ghost: 'bg-transparent border border-[var(--border-subtle)] rounded-2xl',
  glass:
    'bg-[var(--bg-surface)]/60 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl',
}

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
