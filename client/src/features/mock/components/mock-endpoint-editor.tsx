import { FieldEditor } from '@/components/schema/field-editor'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import type { FakerMethodCategory } from '@/types/faker'
import type * as React from 'react'
import { MOCK_METHODS } from '../constants/definition'
import type { MockEntry, MockMethod } from '../types/definition'
import { MockHeadersEditor } from './mock-headers-editor'
import { MockResponseEditor } from './mock-response-editor'

interface MockEndpointEditorProps {
  entry: MockEntry
  methods: FakerMethodCategory[]
  locales: string[]
  onChange: (entry: MockEntry) => void
  onIssue: (id: string, message: string) => void
}

export const MockEndpointEditor: React.FC<MockEndpointEditorProps> = ({
  entry,
  methods,
  locales,
  onChange,
  onIssue,
}) => (
  <div className='space-y-6'>
    <div className={`grid gap-3 ${entry.kind === 'endpoint' ? 'sm:grid-cols-[8rem_minmax(0,1fr)]' : ''}`}>
      {entry.kind === 'endpoint' && (
        <Field className='gap-2'>
          <FieldLabel>Method</FieldLabel>
          <SearchSelect
            label='Endpoint method'
            value={entry.method}
            options={MOCK_METHODS.map((method) => ({ value: method, label: method }))}
            onChange={(method) => onChange({ ...entry, method: method as MockMethod })}
          />
        </Field>
      )}
      <Field className='gap-2'>
        <FieldLabel htmlFor='mock-endpoint-path'>Path</FieldLabel>
        <Input
          id='mock-endpoint-path'
          className='font-mono text-sm'
          value={entry.path}
          onChange={(event) => onChange({ ...entry, path: event.target.value })}
        />
      </Field>
    </div>
    <p className='text-sm leading-6 text-muted-foreground'>
      {entry.kind === 'resource'
        ? 'GET and POST use this collection path. GET, PUT, PATCH, and DELETE also work at /:id. Writes leave later reads unchanged.'
        : 'Use named parameters such as /users/:id. This response runs unless a scenario matches the request.'}
    </p>
    {entry.kind === 'resource' ? (
      <>
        <div className='grid gap-3 sm:grid-cols-3'>
          <Field className='gap-2'>
            <FieldLabel htmlFor='resource-count'>Records</FieldLabel>
            <Input
              id='resource-count'
              type='number'
              min={1}
              max={100}
              value={entry.count || ''}
              onChange={(event) => onChange({ ...entry, count: Number(event.target.value) })}
            />
          </Field>
          <Field className='gap-2'>
            <FieldLabel>Locale</FieldLabel>
            <SearchSelect
              label='Resource locale'
              value={entry.locale}
              options={locales.map((locale) => ({ value: locale, label: locale }))}
              onChange={(locale) => onChange({ ...entry, locale })}
            />
          </Field>
          <Field className='gap-2'>
            <FieldLabel htmlFor='resource-delay'>Delay (ms)</FieldLabel>
            <Input
              id='resource-delay'
              type='number'
              min={0}
              max={5000}
              value={entry.delayMs}
              onChange={(event) => onChange({ ...entry, delayMs: Number(event.target.value) })}
            />
          </Field>
        </div>
        <section>
          <h3 className='mb-3 text-sm font-semibold'>Record schema</h3>
          <div className='overflow-hidden rounded-lg border border-border'>
            <FieldEditor
              schema={entry.schema}
              methods={methods}
              onChange={(schema) => onChange({ ...entry, schema })}
              onValidityChange={(valid) =>
                onIssue(
                  'resource-schema',
                  valid ? '' : 'Finish the highlighted schema edits before calling or sharing this mock.',
                )
              }
            />
          </div>
          <p className='mt-3 text-xs text-muted-foreground'>
            Each record gets a numeric ID from 1 to the record count.
          </p>
        </section>
        <details className='border-t border-border pt-4'>
          <summary className='cursor-pointer text-sm font-medium'>Response headers</summary>
          <div className='pt-4'>
            <MockHeadersEditor
              id='resource-headers'
              label='Response headers (JSON)'
              value={entry.headers}
              onChange={(headers) => onChange({ ...entry, headers })}
              onIssue={(message) => onIssue('resource-headers', message)}
            />
          </div>
        </details>
      </>
    ) : (
      <MockResponseEditor
        id='default-response'
        response={entry.response}
        methods={methods}
        locales={locales}
        onChange={(response) => onChange({ ...entry, response })}
        onIssue={onIssue}
      />
    )}
  </div>
)
