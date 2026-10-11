import { FieldEditor } from '@/components/schema/field-editor'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { Textarea } from '@/components/ui/textarea'
import type { FakerMethodCategory } from '@/types/faker'
import type * as React from 'react'
import type { MockResponse } from '../types/definition'
import { createMockResponse } from '../utils/builder'
import { MockHeadersEditor } from './mock-headers-editor'

interface MockResponseEditorProps {
  id: string
  response: MockResponse
  methods: FakerMethodCategory[]
  locales: string[]
  onChange: (response: MockResponse) => void
  onIssue: (id: string, message: string) => void
}

export const MockResponseEditor: React.FC<MockResponseEditorProps> = ({
  id,
  response,
  methods,
  locales,
  onChange,
  onIssue,
}) => (
  <div className='space-y-5'>
    <div className='grid gap-3 sm:grid-cols-3'>
      <Field className='gap-2'>
        <FieldLabel>Response type</FieldLabel>
        <SearchSelect
          label='Response type'
          value={response.kind}
          options={[
            { value: 'json', label: 'Fixed JSON' },
            { value: 'text', label: 'Plain text' },
            { value: 'generated', label: 'Generated JSON' },
          ]}
          onChange={(kind) => {
            onIssue(`${id}-schema`, '')
            onIssue(`${id}-headers`, '')
            onChange({
              ...createMockResponse(kind as MockResponse['kind']),
              status: response.status,
              headers: response.headers,
              delayMs: response.delayMs,
            })
          }}
        />
      </Field>
      <Field className='gap-2'>
        <FieldLabel htmlFor={`${id}-status`}>Status code</FieldLabel>
        <Input
          id={`${id}-status`}
          type='number'
          min={200}
          max={599}
          value={response.status || ''}
          onChange={(event) => onChange({ ...response, status: Number(event.target.value) })}
        />
      </Field>
      <Field className='gap-2'>
        <FieldLabel htmlFor={`${id}-delay`}>Delay (ms)</FieldLabel>
        <Input
          id={`${id}-delay`}
          type='number'
          min={0}
          max={5000}
          value={response.delayMs}
          onChange={(event) => onChange({ ...response, delayMs: Number(event.target.value) })}
        />
      </Field>
    </div>
    {response.kind === 'generated' ? (
      <>
        <FieldEditor
          schema={response.schema}
          methods={methods}
          onChange={(schema) => onChange({ ...response, schema })}
          onValidityChange={(valid) =>
            onIssue(
              `${id}-schema`,
              valid ? '' : 'Finish the highlighted schema edits before calling or sharing this mock.',
            )
          }
        />
        <div className='grid gap-3 sm:grid-cols-2'>
          <Field className='gap-2'>
            <FieldLabel htmlFor={`${id}-count`}>Records</FieldLabel>
            <Input
              id={`${id}-count`}
              type='number'
              min={1}
              max={100}
              value={response.count || ''}
              onChange={(event) => onChange({ ...response, count: Number(event.target.value) })}
            />
          </Field>
          <Field className='gap-2'>
            <FieldLabel>Locale</FieldLabel>
            <SearchSelect
              label='Response locale'
              value={response.locale}
              options={locales.map((locale) => ({ value: locale, label: locale }))}
              onChange={(locale) => onChange({ ...response, locale })}
            />
          </Field>
        </div>
        {response.paginated && (
          <p className='text-xs text-muted-foreground'>
            This imported response supports page, limit, and sort query parameters.
          </p>
        )}
      </>
    ) : (
      <Field className='gap-2'>
        <FieldLabel htmlFor={`${id}-body`}>Response body</FieldLabel>
        <Textarea
          id={`${id}-body`}
          rows={7}
          className='font-mono text-xs leading-6'
          value={response.body}
          onChange={(event) => onChange({ ...response, body: event.target.value })}
        />
      </Field>
    )}
    <details className='border-t border-border pt-4'>
      <summary className='cursor-pointer text-sm font-medium'>Response headers</summary>
      <div className='pt-4'>
        <MockHeadersEditor
          key={`${id}-${response.kind}`}
          id={`${id}-headers`}
          label='Response headers (JSON)'
          value={response.headers}
          onChange={(headers) => onChange({ ...response, headers })}
          onIssue={(message) => onIssue(`${id}-headers`, message)}
        />
      </div>
    </details>
  </div>
)
