import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import type * as React from 'react'
import { cn } from '@/utils/classes'

type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Popup> & { side?: 'left' | 'right' }

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close
export const SheetTitle = SheetPrimitive.Title
export const SheetDescription = SheetPrimitive.Description
export const SheetHeader: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-2', className)} {...props} />
)
export const SheetContent: React.FC<SheetContentProps> = ({ className, side = 'right', ...props }) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Backdrop className='fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 ease-[cubic-bezier(.23,1,.32,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0' />
    <SheetPrimitive.Popup
      className={cn(
        'fixed inset-y-0 z-50 flex w-[min(26rem,calc(100vw-2rem))] flex-col gap-4 overflow-y-auto bg-background p-6 text-foreground shadow-lg outline-none transition-[transform,opacity] duration-300 ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:data-[starting-style]:translate-x-0 motion-reduce:data-[ending-style]:translate-x-0 motion-reduce:data-[starting-style]:opacity-0 motion-reduce:data-[ending-style]:opacity-0',
        side === 'left'
          ? 'left-0 data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full'
          : 'right-0 data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
        className,
      )}
      {...props}
    />
  </SheetPrimitive.Portal>
)
