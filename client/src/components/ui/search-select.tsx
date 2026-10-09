import { Combobox } from '@base-ui/react/combobox'
import { Check, ChevronDown } from 'lucide-react'
import type * as React from 'react'
import { useMemo } from 'react'
import type { SelectOption } from '@/types/ui'
import { getSelectedOption } from '@/utils/ui'
import { cn } from '@/utils/classes'

interface SearchSelectProps {
  id?: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  label: string
  placeholder?: string
  emptyMessage?: string
  className?: string
  leadingIcon?: React.ReactNode
  invalid?: boolean
  'aria-describedby'?: string
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  id,
  value,
  options,
  onChange,
  label,
  placeholder = 'Search options…',
  emptyMessage = 'No matching options found.',
  className,
  leadingIcon,
  invalid,
  'aria-describedby': describedBy,
}) => {
  const selected = useMemo(() => getSelectedOption(options, value), [options, value])

  return (
    <Combobox.Root
      items={options}
      value={selected}
      onValueChange={(option: SelectOption | null) => {
        if (option) onChange(option.value)
      }}
      isItemEqualToValue={(a, b) => a?.value === b?.value}
      autoHighlight
    >
      <div
        className={cn(
          'flex h-11 w-full min-w-0 items-center rounded-md border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 md:h-10',
          className,
          invalid && 'border-destructive ring-[3px] ring-destructive/20',
        )}
      >
        <Combobox.Input
          id={id}
          aria-label={label}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          placeholder={placeholder}
          title={selected?.label}
          className='h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
        />
        {leadingIcon && (
          <span
            aria-hidden='true'
            className='order-first flex shrink-0 items-center ps-3 text-muted-foreground [&_svg]:size-4'
          >
            {leadingIcon}
          </span>
        )}
        <Combobox.Trigger
          aria-label={`Choose ${label.toLowerCase()}`}
          className='grid h-full w-11 shrink-0 place-items-center rounded-e-md text-muted-foreground outline-none transition-colors hover:text-foreground active:bg-accent active:text-accent-foreground active:transition-none focus-visible:ring-2 focus-visible:ring-ring md:w-10 [&_svg]:size-4'
        >
          <ChevronDown aria-hidden='true' />
        </Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={6} className='z-50 outline-none'>
          <Combobox.Popup className='max-h-[min(var(--available-height),22rem)] w-[var(--anchor-width)] max-w-[calc(100vw-2rem)] overscroll-contain overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md'>
            <Combobox.Empty className='px-3 py-2 text-sm text-muted-foreground'>{emptyMessage}</Combobox.Empty>
            <Combobox.List>
              {(option: SelectOption) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  className='flex cursor-default items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                >
                  <span className='min-w-0'>
                    {option.label}
                    {option.description && (
                      <small className='mt-0.5 block truncate text-xs text-muted-foreground'>
                        {option.description}
                      </small>
                    )}
                  </span>
                  <Combobox.ItemIndicator className='grid size-4 shrink-0 place-items-center [&_svg]:size-4'>
                    <Check aria-hidden='true' />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
