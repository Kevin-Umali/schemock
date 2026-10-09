import { buttonVariants } from '@/constants/ui'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cn } from '@/utils/classes'
import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'
export interface ButtonProps extends Omit<ButtonPrimitive.Props, 'className'>, VariantProps<typeof buttonVariants> {
  className?: string
}
export const Button: React.FC<ButtonProps> = ({ className, variant, size, type = 'button', ...props }) => (
  <ButtonPrimitive type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
)
