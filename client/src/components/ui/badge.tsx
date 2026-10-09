import { cn } from '@/utils/classes'
import type * as React from 'react'

type BadgeProps = React.ComponentProps<'span'> & { variant?: 'default' | 'secondary' | 'outline' | 'destructive' }
export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => (
  <span
    data-slot='badge'
    className={cn(
      'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3',
      variant === 'default' && 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
      variant === 'destructive' &&
        'bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20',
      variant === 'outline' && 'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      className,
    )}
    {...props}
  />
)
