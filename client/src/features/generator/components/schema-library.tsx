import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSavedSchemas } from '@/features/generator/hooks/use-saved-schemas'
import type { GeneratorSettings, SavedSchema } from '@/features/generator/types/settings'
import type { Schema } from '@/types/schema'
import { importExample } from '@/utils/schema'
import { Save, Trash2, Upload } from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'
interface ImportSchemaProps {
  onImport: (schema: Schema) => void
}
interface SchemaLibraryProps {
  settings: GeneratorSettings
  onLoad: (settings: SavedSchema) => void
}
export const ImportSchema: React.FC<ImportSchemaProps> = ({ onImport }) => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant='outline' size='sm' />}>
        <Upload data-icon='inline-start' /> Import JSON
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start from a JSON example</DialogTitle>
          <DialogDescription>
            Paste a sample object or an array of objects. We’ll suggest generators from the field names and value types.
            Review them before generating.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor='json-example'>JSON example</FieldLabel>
            <Textarea
              id='json-example'
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                setError('')
              }}
              className='min-h-64 font-mono text-sm'
              placeholder={'{\n  "name": "Maya Reyes",\n  "email": "maya@example.test"\n}'}
              aria-invalid={Boolean(error)}
            />
            {error && <FieldError role='alert'>{error}</FieldError>}
          </Field>
        </FieldGroup>
        <Button
          disabled={!text.trim()}
          onClick={() => {
            try {
              onImport(importExample(text))
              setOpen(false)
              setError('')
            } catch (error) {
              setError((error as Error).message)
            }
          }}
        >
          Build schema from example
        </Button>
      </DialogContent>
    </Dialog>
  )
}
export const SchemaLibrary: React.FC<SchemaLibraryProps> = ({ settings, onLoad }) => {
  const [open, setOpen] = useState(false)
  const library = useSavedSchemas()
  const { entries } = library
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const persist = (next: SavedSchema[]): boolean => {
    const error = library.save(next)
    if (error) setMessage(error)
    return error === null
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (value) library.reload()
        setMessage('')
      }}
    >
      <DialogTrigger render={<Button variant='outline' size='sm' />}>
        <Save data-icon='inline-start' /> Saved schemas
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your schema library</DialogTitle>
          <DialogDescription>
            Save fields and generation settings in this browser. Give each version a name to reuse it later.
          </DialogDescription>
        </DialogHeader>
        <form
          className='flex flex-col gap-3'
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim()) return
            const next = [
              ...entries,
              { ...settings, id: crypto.randomUUID(), name: name.trim(), updatedAt: new Date().toISOString() },
            ]
            if (persist(next)) {
              setName('')
              setMessage('Schema saved.')
            }
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='schema-name'>Schema name</FieldLabel>
              <Input
                id='schema-name'
                placeholder='e.g. Customer directory'
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <Button type='submit' disabled={!name.trim()} className='self-start'>
            Save current
          </Button>
        </form>
        {(message || library.error) && (
          <p role='status' className='text-sm'>
            {message || library.error}
          </p>
        )}
        <div className='flex max-h-80 flex-col overflow-auto'>
          {entries.length ? (
            entries.map((entry) => (
              <div key={entry.id} className='flex items-center gap-2 border-t border-border py-3'>
                <Button
                  variant='ghost'
                  className='h-auto min-w-0 flex-1 flex-col items-start justify-start whitespace-normal px-3 py-2 text-left'
                  onClick={() => {
                    onLoad(entry)
                    setOpen(false)
                  }}
                >
                  <strong className='font-medium'>{entry.name}</strong>
                  <span className='text-xs text-muted-foreground'>
                    {Object.keys(entry.schema).length} fields · {entry.count} records · {entry.locale}
                  </span>
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label={`Delete saved schema ${entry.name}`}
                  onClick={() => persist(entries.filter((item) => item.id !== entry.id))}
                >
                  <Trash2 />
                </Button>
              </div>
            ))
          ) : (
            <Empty className='min-h-32'>
              <EmptyTitle>No saved schemas</EmptyTitle>
              <EmptyDescription>Your saved schemas will appear here.</EmptyDescription>
            </Empty>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
