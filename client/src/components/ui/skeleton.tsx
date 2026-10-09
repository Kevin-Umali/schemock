import { cn } from '@/utils/classes'
import type * as React from 'react'

export const Skeleton: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    data-slot='skeleton'
    aria-hidden='true'
    className={cn('animate-pulse rounded-md bg-muted', className)}
    {...props}
  />
)
