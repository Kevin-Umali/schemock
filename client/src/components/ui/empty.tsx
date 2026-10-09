import { cn } from '@/utils/classes'
import type * as React from 'react'

export const Empty: React.FC<React.ComponentProps<'section'>> = ({ className, ...props }) => (
  <section
    data-slot='empty'
    className={cn(
      'flex min-w-0 flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border p-6 text-center',
      className,
    )}
    {...props}
  />
)
export const EmptyHeader: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    data-slot='empty-header'
    className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
    {...props}
  />
)
export const EmptyMedia: React.FC<React.ComponentProps<'div'> & { variant?: 'default' | 'icon' }> = ({
  className,
  variant = 'default',
  ...props
}) => (
  <div
    data-slot='empty-media'
    data-variant={variant}
    className={cn(
      'mb-2 flex shrink-0 items-center justify-center [&_svg]:size-5',
      variant === 'icon' && 'size-12 rounded-lg bg-muted text-muted-foreground [&_svg]:size-5',
      className,
    )}
    {...props}
  />
)
export const EmptyTitle: React.FC<React.ComponentProps<'h3'>> = ({ className, ...props }) => (
  <h3 data-slot='empty-title' className={cn('text-base font-medium tracking-tight', className)} {...props} />
)
export const EmptyDescription: React.FC<React.ComponentProps<'p'>> = ({ className, ...props }) => (
  <p
    data-slot='empty-description'
    className={cn('text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4', className)}
    {...props}
  />
)
export const EmptyContent: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    data-slot='empty-content'
    className={cn('flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm', className)}
    {...props}
  />
)
