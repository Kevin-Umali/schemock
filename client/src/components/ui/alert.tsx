import { cn } from '@/utils/classes'
import type * as React from 'react'

type AlertProps = React.ComponentProps<'div'> & { variant?: 'default' | 'destructive' }
export const Alert: React.FC<AlertProps> = ({ className, variant = 'default', ...props }) => (
  <div
    role='alert'
    data-slot='alert'
    className={cn(
      'relative grid w-full gap-1.5 rounded-lg border border-border bg-card p-4 text-sm text-card-foreground [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
      variant === 'destructive' && 'border-destructive/50 text-destructive [&>svg]:text-destructive',
      className,
    )}
    {...props}
  />
)
export const AlertTitle: React.FC<React.ComponentProps<'h5'>> = ({ className, ...props }) => (
  <h5 data-slot='alert-title' className={cn('font-medium leading-none tracking-tight', className)} {...props} />
)
export const AlertDescription: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    data-slot='alert-description'
    className={cn('text-sm text-muted-foreground [&_p]:leading-relaxed', className)}
    {...props}
  />
)
