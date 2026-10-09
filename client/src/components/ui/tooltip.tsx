import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import type * as React from 'react'
import { cn } from '@/utils/classes'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip: React.FC<React.ComponentProps<typeof TooltipPrimitive.Root>> = ({ ...props }) => (
  <TooltipPrimitive.Root {...props} />
)
export const TooltipTrigger: React.FC<React.ComponentProps<typeof TooltipPrimitive.Trigger>> = ({ ...props }) => (
  <TooltipPrimitive.Trigger {...props} />
)
export const TooltipContent: React.FC<React.ComponentProps<typeof TooltipPrimitive.Popup>> = ({
  className,
  ...props
}) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner className='z-50 outline-none'>
      <TooltipPrimitive.Popup
        className={cn(
          'z-50 max-w-xs rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
)
