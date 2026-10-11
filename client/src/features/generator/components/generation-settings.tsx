import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { useIsMobile } from '@/hooks/use-is-mobile'
import type { GeneratorSettings } from '@/features/generator/types/settings'
import { isValidTableName } from '@/features/generator/utils/settings'
import type { OutputFormat } from '@/types/schema'
import { localeLabel } from '@/utils/locale'
import { LoaderCircle, Play, SlidersHorizontal } from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'

interface GenerationSettingsProps {
  format: OutputFormat
  settings: GeneratorSettings
  locales: string[]
  isPending: boolean
  onChange: (patch: Partial<GeneratorSettings>) => void
  onGenerate: () => void
}

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  format,
  settings,
  locales,
  isPending,
  onChange,
  onGenerate,
}) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const validCount = Number.isInteger(settings.count) && settings.count >= 1 && settings.count <= 100
  const validTable = isValidTableName(format, settings.tableName)
  const validLocale = locales.includes(settings.locale)
  return (
    <Collapsible
      render={<section />}
      aria-label='Generation settings'
      open={!isMobile || open}
      onOpenChange={setOpen}
      className='grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-b bg-muted/40 px-4 py-3 md:gap-5 md:px-6'
    >
      <CollapsibleTrigger
        render={<Button variant='ghost' />}
        className='col-start-1 row-start-1 h-auto min-h-11 min-w-0 justify-start px-0 md:hidden'
      >
        <SlidersHorizontal size={16} />
        <span className='min-w-0 text-left'>
          <span className='block'>Settings</span>
          <span className='block truncate text-xs font-normal text-muted-foreground'>
            {settings.count} {settings.count === 1 ? 'record' : 'records'} · {settings.locale}
          </span>
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className='col-span-2 row-start-2 flex min-w-0 flex-wrap items-end gap-x-5 gap-y-3 md:col-span-1 md:row-start-1'>
        <Field className='w-24 shrink-0' data-invalid={!validCount}>
          <FieldLabel htmlFor='record-count'>Records</FieldLabel>
          <Input
            id='record-count'
            type='number'
            min={1}
            max={100}
            value={settings.count || ''}
            onChange={(event) => onChange({ count: Number(event.target.value) })}
            aria-invalid={!validCount}
            aria-describedby={!validCount ? 'record-count-error' : undefined}
          />
          {!validCount && <FieldError id='record-count-error'>Use 1 to 100.</FieldError>}
        </Field>
        <Field className='min-w-44 flex-1 md:max-w-64' data-invalid={!validLocale}>
          <FieldLabel htmlFor='data-locale'>Data locale</FieldLabel>
          <SearchSelect
            id='data-locale'
            label='Data locale'
            value={settings.locale}
            options={locales.map((locale) => ({ value: locale, label: localeLabel(locale) }))}
            onChange={(locale) => onChange({ locale })}
          />
          {!validLocale && <FieldError>Choose a supported locale.</FieldError>}
        </Field>
        {format === 'sql' && (
          <Field className='min-w-40 flex-1 md:max-w-56' data-invalid={!validTable}>
            <FieldLabel htmlFor='table-name'>Table name</FieldLabel>
            <Input
              id='table-name'
              value={settings.tableName}
              aria-invalid={!validTable}
              aria-describedby={!validTable ? 'table-name-error' : undefined}
              onChange={(event) => onChange({ tableName: event.target.value })}
            />
            {!validTable && (
              <FieldError id='table-name-error'>Use 1 to 64 letters, numbers, or underscores.</FieldError>
            )}
          </Field>
        )}
        {format !== 'json' && (
          <div className='flex flex-wrap gap-x-5 gap-y-3 py-2'>
            <Field orientation='horizontal' className='w-auto'>
              <Checkbox
                id='flatten-output'
                checked={settings.flatten}
                onCheckedChange={(checked) => onChange({ flatten: Boolean(checked) })}
              />
              <FieldLabel htmlFor='flatten-output'>Flatten objects</FieldLabel>
            </Field>
            {format === 'sql' && (
              <Field orientation='horizontal' className='w-auto'>
                <Checkbox
                  id='combine-insert'
                  checked={settings.multiRowInsert}
                  onCheckedChange={(checked) => onChange({ multiRowInsert: Boolean(checked) })}
                />
                <FieldLabel htmlFor='combine-insert'>One INSERT statement</FieldLabel>
              </Field>
            )}
          </div>
        )}
      </CollapsibleContent>
      <Button
        onClick={() => {
          if (isMobile && (!validCount || !validTable || !validLocale)) {
            setOpen(true)
            requestAnimationFrame(onGenerate)
          } else onGenerate()
        }}
        disabled={isPending}
        className='col-start-2 row-start-1 min-h-11 md:min-w-44'
      >
        {isPending ? (
          <LoaderCircle className='animate-spin motion-reduce:animate-none' />
        ) : (
          <Play data-icon='inline-start' />
        )}
        {isPending ? 'Generating…' : `Generate ${format.toUpperCase()}`}
      </Button>
    </Collapsible>
  )
}
