import { Field as FieldPrimitive } from '@base-ui/react/field'
import { cn } from '@/utils/classes'
import type * as React from 'react'

type FieldProps = FieldPrimitive.Root.Props & { orientation?: 'vertical' | 'horizontal' | 'responsive' }
type FieldLabelProps = FieldPrimitive.Label.Props
type FieldDescriptionProps = FieldPrimitive.Description.Props
type FieldErrorProps = React.ComponentProps<'div'>

export const Field: React.FC<FieldProps> = ({ className, orientation = 'vertical', ...props }) => (
  <FieldPrimitive.Root
    data-slot='field'
    data-orientation={orientation}
    className={cn(
      'group/field flex w-full gap-3 data-[invalid=true]:text-destructive',
      orientation === 'vertical' && 'flex-col *:w-full [&>.sr-only]:w-auto',
      orientation === 'horizontal' &&
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto',
      orientation === 'responsive' && 'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center',
      className,
    )}
    {...props}
  />
)
export const FieldLabel: React.FC<FieldLabelProps> = ({ className, ...props }) => (
  <FieldPrimitive.Label
    data-slot='field-label'
    className={cn(
      'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
      className,
    )}
    {...props}
  />
)
export const FieldDescription: React.FC<FieldDescriptionProps> = ({ className, ...props }) => (
  <FieldPrimitive.Description
    data-slot='field-description'
    className={cn('text-sm leading-relaxed text-muted-foreground', className)}
    {...props}
  />
)
export const FieldError: React.FC<FieldErrorProps> = ({ className, ...props }) => (
  <div data-slot='field-error' className={cn('text-sm font-normal text-destructive', className)} {...props} />
)
export const FieldGroup: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    role='group'
    data-slot='field-group'
    className={cn(
      'group/field-group @container/field-group flex w-full flex-col gap-6 *:data-[slot=field-group]:gap-4',
      className,
    )}
    {...props}
  />
)
export const FieldSet: React.FC<React.ComponentProps<'fieldset'>> = ({ className, ...props }) => (
  <fieldset data-slot='field-set' className={cn('flex flex-col gap-6', className)} {...props} />
)
export const FieldLegend: React.FC<React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }> = ({
  className,
  variant = 'legend',
  ...props
}) => (
  <legend
    data-slot='field-legend'
    data-variant={variant}
    className={cn('mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base', className)}
    {...props}
  />
)
export const FieldContent: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    data-slot='field-content'
    className={cn('group/field-content flex min-w-0 flex-1 flex-col gap-1 leading-snug', className)}
    {...props}
  />
)
