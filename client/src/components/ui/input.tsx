import { cn } from '@/utils/classes'
import type * as React from 'react'
export const Input: React.FC<React.ComponentProps<'input'>> = ({ className, ...props }) => (
  <input
    data-slot='input'
    className={cn(
      'flex h-11 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-colors file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:h-10 md:text-sm',
      className,
    )}
    {...props}
  />
)
