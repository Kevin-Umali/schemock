import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/utils/classes'

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Popup>
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export const DialogContent: React.FC<DialogContentProps> = ({ className, children, ...props }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Backdrop className='fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 ease-[cubic-bezier(.23,1,.32,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0' />
    <DialogPrimitive.Popup
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl bg-background p-6 text-foreground shadow-lg outline-none transition-[opacity,transform] duration-220 ease-[cubic-bezier(.23,1,.32,1)] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100 sm:w-full',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label='Close dialog'
        className='absolute right-4 top-4 grid size-8 place-items-center rounded-md text-muted-foreground opacity-70 outline-none transition-opacity hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4'
      >
        <X aria-hidden='true' />
      </DialogPrimitive.Close>
    </DialogPrimitive.Popup>
  </DialogPrimitive.Portal>
)
export const DialogHeader: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
)
