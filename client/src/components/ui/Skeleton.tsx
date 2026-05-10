import { cn } from '../../lib/cn'

type SkeletonVariant = 'text' | 'circle' | 'card' | 'rect'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  width?: string | number
  height?: string | number
  shimmer?: boolean
}

export function Skeleton({
  variant = 'text',
  className,
  width,
  height,
  shimmer = true,
}: SkeletonProps) {
  const baseStyle = shimmer
    ? 'bg-gradient-to-r from-[var(--bg-surface-2)] via-[var(--bg-surface-3)] to-[var(--bg-surface-2)] bg-[length:400px_100%] animate-shimmer'
    : 'bg-[var(--bg-surface-2)] animate-pulse'

  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'h-4 w-full rounded-md',
    circle: 'rounded-full',
    card: 'w-full h-48 rounded-2xl',
    rect: 'rounded-lg',
  }

  return (
    <div
      className={cn(baseStyle, variantStyles[variant], className)}
      style={{
        width: width,
        height: height,
      }}
    />
  )
}
