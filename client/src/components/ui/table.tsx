import type * as React from 'react'
import { cn } from '@/utils/classes'
import { useId, useRef } from 'react'
import { useHorizontalOverflow } from '@/hooks/use-horizontal-overflow'
import { ArrowLeftRight } from 'lucide-react'

export const Table: React.FC<React.ComponentProps<'table'>> = ({ className, ...props }) => {
  const viewport = useRef<HTMLDivElement>(null)
  const hintId = useId()
  const overflowing = useHorizontalOverflow(viewport)
  return (
    <div className='min-w-0'>
      {overflowing && (
        <p
          id={hintId}
          className='flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground'
        >
          <ArrowLeftRight className='size-3.5 shrink-0' aria-hidden='true' />
          Scroll sideways to see more columns.
        </p>
      )}
      <div
        ref={viewport}
        data-slot='table-container'
        className='relative w-full overflow-x-auto'
        role={overflowing ? 'region' : undefined}
        aria-label={overflowing ? 'Scrollable table' : undefined}
        aria-describedby={overflowing ? hintId : undefined}
        tabIndex={overflowing ? 0 : undefined}
      >
        <table data-slot='table' className={cn('w-full caption-bottom text-sm', className)} {...props} />
      </div>
    </div>
  )
}
export const TableHeader: React.FC<React.ComponentProps<'thead'>> = ({ className, ...props }) => (
  <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...props} />
)
export const TableBody: React.FC<React.ComponentProps<'tbody'>> = ({ className, ...props }) => (
  <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
export const TableFooter: React.FC<React.ComponentProps<'tfoot'>> = ({ className, ...props }) => (
  <tfoot
    data-slot='table-footer'
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
)
export const TableRow: React.FC<React.ComponentProps<'tr'>> = ({ className, ...props }) => (
  <tr
    data-slot='table-row'
    className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
    {...props}
  />
)
export const TableHead: React.FC<React.ComponentProps<'th'>> = ({ className, ...props }) => (
  <th
    data-slot='table-head'
    className={cn(
      'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
)
export const TableCell: React.FC<React.ComponentProps<'td'>> = ({ className, ...props }) => (
  <td
    data-slot='table-cell'
    className={cn('px-2 py-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
)
export const TableCaption: React.FC<React.ComponentProps<'caption'>> = ({ className, ...props }) => (
  <caption data-slot='table-caption' className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
)
