import type * as React from 'react'
import { cn } from '@/utils/classes'

type InputGroupAddonProps = React.ComponentProps<'div'> & {
  align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}
export const InputGroup: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    data-slot='input-group'
    className={cn(
      'flex min-h-11 w-full min-w-0 items-center rounded-md border border-input bg-background shadow-xs outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive/20 [&>input]:flex-1 [&>textarea]:flex-1 md:min-h-10',
      className,
    )}
    {...props}
  />
)
export const InputGroupInput: React.FC<React.ComponentProps<'input'>> = ({ className, ...props }) => (
  <input
    data-slot='input-group-control'
    className={cn(
      'h-[calc(2.75rem-2px)] min-w-0 flex-1 border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 md:h-[calc(2.5rem-2px)] md:text-sm',
      className,
    )}
    {...props}
  />
)
export const InputGroupTextarea: React.FC<React.ComponentProps<'textarea'>> = ({ className, ...props }) => (
  <textarea
    data-slot='input-group-control'
    className={cn(
      'min-h-20 min-w-0 flex-1 resize-y border-0 bg-transparent px-3 py-2 text-base shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 md:text-sm',
      className,
    )}
    {...props}
  />
)
export const InputGroupAddon: React.FC<InputGroupAddonProps> = ({ className, align = 'inline-start', ...props }) => (
  <div
    data-slot='input-group-addon'
    data-align={align}
    className={cn(
      'flex shrink-0 items-center gap-2 px-3 text-sm text-muted-foreground [&_svg]:size-4',
      align === 'inline-start' && 'order-first',
      align === 'inline-end' && 'order-last',
      align === 'block-start' && 'w-full border-b px-3 py-2',
      align === 'block-end' && 'w-full border-t px-3 py-2',
      className,
    )}
    {...props}
  />
)
