import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { cn } from '@/utils/classes'
import { Check } from 'lucide-react'
import type * as React from 'react'

type CheckboxProps = CheckboxPrimitive.Root.Props
export const Checkbox: React.FC<CheckboxProps> = ({ className, children, ...props }) => (
  <CheckboxPrimitive.Root
    data-slot='checkbox'
    className={cn(
      'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground group-has-disabled/field:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot='checkbox-indicator'
      className='grid place-content-center text-current [&>svg]:size-3.5'
    >
      <Check aria-hidden='true' />
    </CheckboxPrimitive.Indicator>
    {children}
  </CheckboxPrimitive.Root>
)
