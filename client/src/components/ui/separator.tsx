import { cn } from '@/utils/classes'
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import type * as React from 'react'

type SeparatorProps = SeparatorPrimitive.Props & { decorative?: boolean }
export const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => (
  <SeparatorPrimitive
    data-slot='separator'
    orientation={orientation}
    role={decorative ? 'none' : 'separator'}
    aria-hidden={decorative || undefined}
    className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    {...props}
  />
)
