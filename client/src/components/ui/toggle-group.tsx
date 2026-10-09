import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cn } from '@/utils/classes'
import type { VariantProps } from 'class-variance-authority'
import { toggleVariants } from '@/constants/toggle'
import type * as React from 'react'

type ToggleGroupProps = ToggleGroupPrimitive.Props<string>
type ToggleGroupItemProps = TogglePrimitive.Props & VariantProps<typeof toggleVariants>
export const ToggleGroup: React.FC<ToggleGroupProps> = ({ className, ...props }) => (
  <ToggleGroupPrimitive
    data-slot='toggle-group'
    className={cn('group/toggle-group flex w-fit items-center gap-1 data-[orientation=vertical]:flex-col', className)}
    {...props}
  />
)
export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({ className, variant, size, ...props }) => (
  <TogglePrimitive
    data-slot='toggle-group-item'
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
)
