import { cva } from 'class-variance-authority'
export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted data-[pressed]:bg-muted',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground data-[pressed]:bg-accent',
      },
      size: {
        default: 'h-11 min-w-11 px-2 md:h-10 md:min-w-10',
        sm: 'h-11 min-w-11 px-1.5 md:h-9 md:min-w-9',
        lg: 'h-11 min-w-11 px-2.5 md:h-10 md:min-w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
