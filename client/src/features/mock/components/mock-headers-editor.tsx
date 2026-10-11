import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import type * as React from 'react'
import { useEffect, useState } from 'react'

interface MockHeadersEditorProps {
  id: string
  label: string
  value: Record<string, string>
  onChange: (headers: Record<string, string>) => void
  onIssue: (message: string) => void
}

export const MockHeadersEditor: React.FC<MockHeadersEditorProps> = ({ id, label, value, onChange, onIssue }) => {
  const [draft, setDraft] = useState(() => ({ source: value, text: JSON.stringify(value, null, 2), error: '' }))
  if (draft.source !== value) setDraft({ source: value, text: JSON.stringify(value, null, 2), error: '' })
  useEffect(() => onIssue(draft.error), [draft.error, onIssue])
  return (
    <Field className='gap-2'>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        className='font-mono text-xs'
        rows={3}
        value={draft.text}
        aria-invalid={Boolean(draft.error)}
        aria-describedby={draft.error ? `${id}-error` : undefined}
        onChange={(event) => {
          try {
            const parsed: unknown = JSON.parse(event.target.value || '{}')
            if (
              !parsed ||
              typeof parsed !== 'object' ||
              Array.isArray(parsed) ||
              Object.values(parsed).some((item) => typeof item !== 'string')
            )
              throw new Error('Use a JSON object with string header values.')
            const headers = parsed as Record<string, string>
            setDraft({ source: headers, text: event.target.value, error: '' })
            onChange(headers)
          } catch {
            const message = 'Use a JSON object with string header values.'
            setDraft({ source: value, text: event.target.value, error: message })
          }
        }}
      />
      {draft.error && (
        <p id={`${id}-error`} className='text-xs text-destructive'>
          {draft.error}
        </p>
      )}
    </Field>
  )
}
