import { cn } from '@/utils/classes'
import type * as React from 'react'
export const Textarea: React.FC<React.ComponentProps<'textarea'>> = ({ className, ...props }) => (
  <textarea
    data-slot='textarea'
    className={cn(
      'flex min-h-20 w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm',
      className,
    )}
    {...props}
  />
)
