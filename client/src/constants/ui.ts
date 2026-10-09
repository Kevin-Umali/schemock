import { cva } from 'class-variance-authority'
export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg[data-icon=inline-start]]:-ml-0.5 [&_svg[data-icon=inline-end]]:-mr-0.5 md:min-h-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80 active:transition-none',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 active:bg-destructive/80 active:transition-none',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground active:transition-none',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70 active:transition-none',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent active:transition-none',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2 has-[>svg]:px-3 md:h-10',
        sm: 'h-11 gap-1.5 rounded-md px-3 text-xs has-[>svg]:px-2.5 md:h-9',
        lg: 'h-11 rounded-md px-8 has-[>svg]:px-6 md:h-10',
        icon: 'size-11 p-0 md:size-10',
        'icon-sm': 'size-11 p-0 md:size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
