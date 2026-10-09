import { FIELD_KINDS, FIXED_VALUE_TYPES } from '@/constants/field-inspector'
import { RESERVED_FIELD_NAMES, SCHEMA_LIMITS } from '@/constants/schema-editor'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { FakerMethodCategory } from '@/types/faker'
import type { FieldSourceKind } from '@/types/field-editor'
import type { FieldPath } from '@/types/field-tree'
import type { Schema, SchemaValue } from '@/types/schema'
import { formatFieldPath } from '@/utils/field-tree'
import { createFieldValue, encodeFixedValue, getGeneratorOptions, readFixedValue } from '@/utils/field-inspector'
import { getFieldNameSuggestions } from '@/utils/field-suggestions'
import { getFieldSummary } from '@/utils/fields'
import { isArraySchema, isObject } from '@/utils/schema'
import { ArrowDown, ArrowRight, ArrowUp, Copy, Database, Plus, Trash2 } from 'lucide-react'
import type * as React from 'react'
import { useEffect, useId, useState } from 'react'

interface FieldInspectorProps {
  value: SchemaValue
  path: FieldPath
  parent?: Schema
  methods: FakerMethodCategory[]
  onChange: (value: SchemaValue, undoLabel?: string) => void
  onRename: (name: string) => void
  onValidityChange: (valid: boolean) => void
  onNavigate: (path: FieldPath) => void
  onAdd: (path: FieldPath) => void
  onDuplicate: () => void
  onMove: (offset: -1 | 1) => void
  onRemove: () => void
}

export const FieldInspector: React.FC<FieldInspectorProps> = ({
  value,
  path,
  parent,
  methods,
  onChange,
  onRename,
  onValidityChange,
  onNavigate,
  onAdd,
  onDuplicate,
  onMove,
  onRemove,
}) => {
  const id = useId()
  const segment = path.at(-1)
  const name = segment?.kind === 'field' ? segment.name : 'Each item'
  const [nameDraft, setNameDraft] = useState(name)
  const summary = getFieldSummary(value, methods)
  const kind = summary.kind === 'custom' ? 'generator' : summary.kind
  const fixed = readFixedValue(value)
  const [fixedDraft, setFixedDraft] = useState({ source: value, text: fixed.text })
  const fixedText = fixedDraft.source === value ? fixedDraft.text : fixed.text
  const fixedResult = kind === 'fixed' ? encodeFixedValue(fixed.type, fixedText) : {}
  const arrayCount = isArraySchema(value) ? value.count : 1
  const [countDraft, setCountDraft] = useState({ source: arrayCount, text: String(arrayCount) })
  const countText = countDraft.source === arrayCount ? countDraft.text : String(arrayCount)
  const validCount =
    kind !== 'array' || (Number.isInteger(Number(countText)) && Number(countText) >= 1 && Number(countText) <= 100)
  const nextName = nameDraft.trim()
  const nameError =
    segment?.kind === 'field'
      ? !nextName
        ? 'Give this field a name.'
        : RESERVED_FIELD_NAMES.has(nextName)
          ? 'This name is reserved. Choose another name.'
          : path.length > 1 &&
              ((nextName === 'count' && parent && Object.hasOwn(parent, 'items')) ||
                (nextName === 'items' && parent && Object.hasOwn(parent, 'count')))
            ? 'The names items and count together define an array. Rename one of these fields.'
            : nextName !== name && parent && Object.hasOwn(parent, nextName)
              ? 'A field with this name already exists here.'
              : ''
      : ''
  const valid = !nameError && validCount && !fixedResult.error
  useEffect(() => onValidityChange(valid), [valid, onValidityChange])
  const index = parent ? Object.keys(parent).indexOf(name) : -1
  const selectedKind = FIELD_KINDS.find((item) => item.value === kind) ?? FIELD_KINDS[0]
  const suggestions = getFieldNameSuggestions(nameDraft, methods).filter((suggestion) => suggestion.method !== value)

  return (
    <div className='min-w-0 space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <h3
            data-field-inspector-heading
            tabIndex={-1}
            className='break-words text-xl font-semibold tracking-tight outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring'
          >
            {name}
          </h3>
          <p className='mt-1 break-all font-mono text-xs leading-5 text-muted-foreground'>{formatFieldPath(path)}</p>
        </div>
        {parent && (
          <div className='flex shrink-0 gap-1' aria-label={`Actions for ${name}`}>
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label={`Move ${name} up`}
              disabled={index <= 0}
              onClick={() => onMove(-1)}
            >
              <ArrowUp />
            </Button>
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label={`Move ${name} down`}
              disabled={index >= Object.keys(parent).length - 1}
              onClick={() => onMove(1)}
            >
              <ArrowDown />
            </Button>
            <Button variant='ghost' size='icon-sm' aria-label={`Duplicate ${name}`} onClick={onDuplicate}>
              <Copy />
            </Button>
            <Button variant='ghost' size='icon-sm' aria-label={`Remove ${name}`} onClick={onRemove}>
              <Trash2 />
            </Button>
          </div>
        )}
      </header>
      <FieldGroup className='gap-5'>
        {segment?.kind === 'field' ? (
          <Field data-invalid={Boolean(nameError)}>
            <FieldLabel htmlFor={`${id}-name`}>Field name</FieldLabel>
            <Input
              id={`${id}-name`}
              value={nameDraft}
              aria-invalid={Boolean(nameError)}
              aria-describedby={`${id}-name-help`}
              className='font-mono'
              onChange={(event) => setNameDraft(event.target.value)}
              onBlur={() => {
                if (!nameError && nextName !== name) onRename(nextName)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !nameError && nextName !== name) onRename(nextName)
              }}
            />
            {nameError ? (
              <FieldError id={`${id}-name-help`}>{nameError}</FieldError>
            ) : (
              <FieldDescription id={`${id}-name-help`}>The key in the generated JSON.</FieldDescription>
            )}
          </Field>
        ) : (
          <p className='text-sm leading-6 text-muted-foreground'>
            This schema is repeated for every item in the parent array.
          </p>
        )}
        <Field>
          <FieldLabel id={`${id}-kind-label`}>Field kind</FieldLabel>
          <ToggleGroup
            aria-labelledby={`${id}-kind-label`}
            value={[kind]}
            className='grid w-full grid-cols-2 gap-2 sm:grid-cols-4'
            onValueChange={(values) => {
              const next = values[0] as FieldSourceKind | undefined
              if (next && next !== kind) onChange(createFieldValue(next), `Changed ${name} from ${selectedKind.label}.`)
            }}
          >
            {FIELD_KINDS.map(({ value: source, label, icon: Icon }) => (
              <ToggleGroupItem
                key={source}
                value={source}
                variant='outline'
                className='w-full data-[pressed]:border-foreground data-[pressed]:bg-foreground data-[pressed]:text-background'
                disabled={(source === 'object' || source === 'array') && path.length >= SCHEMA_LIMITS.depth}
              >
                <Icon aria-hidden='true' />
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <FieldDescription>{selectedKind.description}</FieldDescription>
        </Field>
        {kind === 'generator' && (
          <Field data-invalid={summary.kind === 'custom'}>
            <FieldLabel htmlFor={`${id}-generator`}>Faker generator</FieldLabel>
            <SearchSelect
              id={`${id}-generator`}
              label='Faker generator'
              leadingIcon={<Database />}
              value={String(value)}
              options={getGeneratorOptions(value, methods)}
              onChange={onChange}
              placeholder='Search names, email, numbers…'
              invalid={summary.kind === 'custom'}
              aria-describedby={`${id}-generator-help`}
            />
            {summary.kind === 'custom' ? (
              <FieldError id={`${id}-generator-help`}>
                This generator is not recognized. Choose one from the list or correct it in JSON schema.
              </FieldError>
            ) : (
              <FieldDescription id={`${id}-generator-help`} className='break-words'>
                {summary.detail}
              </FieldDescription>
            )}
            {suggestions.length > 0 && (
              <div className='mt-2 border-s-2 border-border ps-3'>
                <p className='text-xs leading-5 text-muted-foreground'>Suggestions for “{nameDraft}”</p>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion.method}
                      size='sm'
                      variant='outline'
                      title={`${suggestion.reason}: ${suggestion.method}`}
                      onClick={() => onChange(suggestion.method)}
                    >
                      {suggestion.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Field>
        )}
        {kind === 'fixed' && (
          <>
            <Field>
              <FieldLabel htmlFor={`${id}-fixed-type`}>Value type</FieldLabel>
              <SearchSelect
                id={`${id}-fixed-type`}
                label='Value type'
                value={fixed.type}
                options={FIXED_VALUE_TYPES}
                onChange={(type) =>
                  onChange(
                    encodeFixedValue(type, type === 'number' ? '0' : type === 'boolean' ? 'false' : '').value ??
                      'custom.literal(null)',
                  )
                }
              />
            </Field>
            {fixed.type !== 'null' && (
              <Field data-invalid={Boolean(fixedResult.error)}>
                <FieldLabel htmlFor={`${id}-fixed-value`}>Fixed value</FieldLabel>
                {fixed.type === 'boolean' ? (
                  <ToggleGroup
                    id={`${id}-fixed-value`}
                    aria-label='Fixed value'
                    value={[fixedText]}
                    onValueChange={(values) => {
                      if (values[0]) onChange(encodeFixedValue('boolean', values[0]).value!)
                    }}
                  >
                    <ToggleGroupItem value='true' variant='outline'>
                      True
                    </ToggleGroupItem>
                    <ToggleGroupItem value='false' variant='outline'>
                      False
                    </ToggleGroupItem>
                  </ToggleGroup>
                ) : (
                  <Input
                    id={`${id}-fixed-value`}
                    inputMode={fixed.type === 'number' ? 'decimal' : 'text'}
                    value={fixedText}
                    aria-invalid={Boolean(fixedResult.error)}
                    aria-describedby={`${id}-fixed-help`}
                    onChange={(event) => setFixedDraft({ source: value, text: event.target.value })}
                    onBlur={() => {
                      if (fixedResult.value) onChange(fixedResult.value)
                    }}
                  />
                )}
                {fixedResult.error ? (
                  <FieldError id={`${id}-fixed-help`}>{fixedResult.error}</FieldError>
                ) : (
                  <FieldDescription id={`${id}-fixed-help`}>
                    This value stays the same in every record.
                  </FieldDescription>
                )}
              </Field>
            )}
            {fixed.type === 'null' && (
              <p className='text-sm text-muted-foreground'>
                Every record will contain <code className='font-mono'>null</code>.
              </p>
            )}
          </>
        )}
        {isArraySchema(value) && (
          <>
            <Field data-invalid={!validCount}>
              <FieldLabel htmlFor={`${id}-count`}>Items per array</FieldLabel>
              <Input
                id={`${id}-count`}
                type='number'
                min={1}
                max={100}
                value={countText}
                aria-invalid={!validCount}
                aria-describedby={`${id}-count-help`}
                onChange={(event) => setCountDraft({ source: arrayCount, text: event.target.value })}
                onBlur={() => {
                  if (validCount) onChange({ ...value, count: Number(countText) })
                }}
              />
              {!validCount ? (
                <FieldError id={`${id}-count-help`}>Use a whole number from 1 to 100.</FieldError>
              ) : (
                <FieldDescription id={`${id}-count-help`}>
                  Each record gets an array with {arrayCount} items.
                </FieldDescription>
              )}
            </Field>
            <div className='border-t border-border pt-5'>
              <h4 className='text-sm font-medium'>Item schema</h4>
              <p className='mt-1 break-words text-sm leading-6 text-muted-foreground'>
                {getFieldSummary(value.items, methods).label} · {getFieldSummary(value.items, methods).detail}
              </p>
              <Button className='mt-3' variant='outline' onClick={() => onNavigate([...path, { kind: 'items' }])}>
                Edit each item
                <ArrowRight data-icon='inline-end' />
              </Button>
            </div>
          </>
        )}
        {kind === 'object' && isObject(value) && !isArraySchema(value) && (
          <section aria-label={`Fields in ${name}`} className='border-t border-border pt-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h4 className='text-sm font-medium'>{Object.keys(value).length} child fields</h4>
              <Button
                size='sm'
                variant='outline'
                disabled={Object.keys(value).length >= SCHEMA_LIMITS.fields || path.length >= SCHEMA_LIMITS.depth}
                onClick={() => onAdd(path)}
              >
                <Plus data-icon='inline-start' />
                Add child field
              </Button>
            </div>
            <ul className='mt-3 divide-y divide-border'>
              {Object.entries(value).map(([childName, childValue]) => (
                <li key={childName}>
                  <Button
                    variant='ghost'
                    className='h-auto min-h-11 w-full justify-between gap-3 rounded-none px-0 py-3 text-start'
                    onClick={() => onNavigate([...path, { kind: 'field', name: childName }])}
                  >
                    <span className='min-w-0'>
                      <span className='block break-all font-mono text-sm'>{childName}</span>
                      <span className='mt-1 block text-xs font-normal text-muted-foreground'>
                        {getFieldSummary(childValue as SchemaValue, methods).label}
                      </span>
                    </span>
                    <ArrowRight className='shrink-0' />
                  </Button>
                </li>
              ))}
            </ul>
            {!Object.keys(value).length && (
              <Alert className='mt-3'>
                <AlertDescription>This object is empty. Add a child field to define its contents.</AlertDescription>
              </Alert>
            )}
          </section>
        )}
      </FieldGroup>
    </div>
  )
}
