import { FieldEditor } from '@/components/schema/field-editor'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { DataPreview } from '@/features/generator/components/data-preview'
import { GenerationSettings } from '@/features/generator/components/generation-settings'
import { ImportSchema, SchemaLibrary } from '@/features/generator/components/schema-library'
import { templates } from '@/features/generator/constants/templates'
import { useGenerator } from '@/features/generator/hooks/use-generator'
import type { EditorMode } from '@/features/generator/types/workspace'
import { isValidTableName } from '@/features/generator/utils/settings'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import type { OutputFormat } from '@/types/schema'
import { checkSchema } from '@/utils/schema-validation'
import { useRouteContext } from '@tanstack/react-router'
import { Check, Copy, Share2, X } from 'lucide-react'
import type * as React from 'react'
import { lazy, Suspense, useMemo, useRef, useState } from 'react'

interface GeneratorWorkspaceProps {
  format: OutputFormat
}

const SchemaCodeEditor = lazy(() =>
  import('@/components/schema/schema-code-editor').then((module) => ({ default: module.SchemaCodeEditor })),
)

export const GeneratorWorkspace: React.FC<GeneratorWorkspaceProps> = ({ format }) => {
  const { fakerMethods, locales } = useRouteContext({ from: '__root__' })
  const {
    settings,
    updateSettings,
    loadSettings,
    setSchema,
    revision,
    notice,
    setNotice,
    generation,
    shareUrl,
    storageError,
  } = useGenerator(format)
  const [mode, setMode] = useState<EditorMode>('fields')
  const [code, setCode] = useState('')
  const [fieldsValid, setFieldsValid] = useState(true)
  const [submitted, setSubmitted] = useState('')
  const schemaEditorRef = useRef<HTMLElement | null>(null)
  const [copied, copy] = useCopyToClipboard()
  const checkedSchema = useMemo(
    () => checkSchema(mode === 'code' ? code : JSON.stringify(settings.schema), fakerMethods),
    [mode, code, settings.schema, fakerMethods],
  )
  const codeError = checkedSchema.issues[0]?.message ?? ''
  const canGenerate =
    fieldsValid &&
    Number.isInteger(settings.count) &&
    settings.count >= 1 &&
    settings.count <= 100 &&
    isValidTableName(format, settings.tableName) &&
    locales.includes(settings.locale) &&
    !codeError &&
    Boolean(Object.keys(settings.schema).length)
  const changeMode = (next: EditorMode) => {
    if (next === 'code' && !fieldsValid) {
      setNotice('Finish the highlighted field edits before opening JSON schema.')
      schemaEditorRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    if (next === 'code') {
      setFieldsValid(true)
      setCode(JSON.stringify(settings.schema, null, 2))
    }
    if (next === 'fields' && codeError) return
    setMode(next)
  }
  const generate = () => {
    if (generation.isPending) return
    if (!canGenerate) {
      const validCount = Number.isInteger(settings.count) && settings.count >= 1 && settings.count <= 100
      if (!validCount) {
        setNotice('Use a whole number from 1 to 100 records.')
        document.getElementById('record-count')?.focus()
      } else if (!isValidTableName(format, settings.tableName)) {
        setNotice('Use 1 to 64 letters, numbers, or underscores for the table name.')
        document.getElementById('table-name')?.focus()
      } else if (!locales.includes(settings.locale)) {
        setNotice('Choose a supported data locale.')
        document.getElementById('data-locale')?.focus()
      } else {
        setNotice(
          codeError ||
            (!fieldsValid
              ? 'Review the schema fields and fix any errors before generating.'
              : 'Add at least one valid field before generating.'),
        )
        schemaEditorRef.current?.focus()
      }
      return
    }
    setNotice('')
    setSubmitted(JSON.stringify(settings))
    generation.mutate(settings)
  }
  const share = async () => {
    const success = await copy(shareUrl())
    setNotice(
      success
        ? 'Share link copied. It includes your fields and settings.'
        : 'Could not copy the link. Check clipboard permissions and try again.',
    )
  }
  return (
    <div className='mx-auto max-w-[1440px] px-4 py-7 md:px-8 md:py-10 lg:px-10'>
      <div className='mb-7 flex flex-wrap items-end justify-between gap-5'>
        <div>
          <div className='flex items-center gap-3'>
            <h1 className='text-3xl font-semibold tracking-[-0.03em] md:text-4xl'>Schema studio</h1>
            <Badge variant='outline'>{format.toUpperCase()}</Badge>
          </div>
          <p className='mt-2 max-w-[70ch] text-sm leading-relaxed text-muted-foreground'>
            Define your fields. Generate data for your next build.
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <ImportSchema
            onImport={(schema) => {
              loadSettings({ ...settings, schema })
              setMode('fields')
              setNotice('Schema imported. Review the suggested generators.')
            }}
          />
          <SchemaLibrary
            settings={settings}
            onLoad={(value) => {
              loadSettings(value)
              setMode('fields')
              setNotice('Saved schema loaded.')
            }}
          />
          <Button variant='outline' size='sm' onClick={share} disabled={!canGenerate}>
            <Share2 data-icon='inline-start' />
            Share
          </Button>
        </div>
      </div>
      {notice && (
        <Alert
          className='mb-5 flex items-center justify-between gap-3 bg-card py-2'
          variant={storageError ? 'destructive' : 'default'}
        >
          <AlertDescription>{notice}</AlertDescription>
          {!storageError && (
            <Button variant='ghost' size='icon' aria-label='Dismiss message' onClick={() => setNotice('')}>
              <X />
            </Button>
          )}
        </Alert>
      )}
      <div className='overflow-hidden rounded-xl border bg-card'>
        <section ref={schemaEditorRef} tabIndex={-1} aria-label='Schema editor'>
          <div className='flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-7'>
            <div className='flex items-center gap-3'>
              <h2 className='font-semibold'>Schema</h2>
              <span className='text-xs tabular-nums text-muted-foreground'>
                {Object.keys(settings.schema).length} {Object.keys(settings.schema).length === 1 ? 'field' : 'fields'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <ToggleGroup
                value={[mode]}
                onValueChange={(values) => {
                  if (values[0]) changeMode(values[0] as EditorMode)
                }}
                aria-label='Editor mode'
              >
                <ToggleGroupItem
                  value='fields'
                  disabled={mode === 'code' && Boolean(codeError)}
                  title={mode === 'code' && codeError ? 'Resolve schema errors to return to Fields' : undefined}
                >
                  Fields
                </ToggleGroupItem>
                <ToggleGroupItem value='code'>JSON schema</ToggleGroupItem>
              </ToggleGroup>
              <Button
                variant='ghost'
                size='icon'
                aria-label='Copy schema'
                onClick={() => copy(mode === 'code' ? code : JSON.stringify(settings.schema, null, 2))}
              >
                {copied?.startsWith('{') ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
          <div
            className='flex flex-wrap items-center gap-1 border-b bg-muted/35 px-5 py-2 md:px-7'
            aria-label='Quick-start templates'
          >
            <span className='mr-2 text-xs text-muted-foreground'>Templates</span>
            {templates.map((template) => (
              <Button
                key={template.id}
                variant='ghost'
                size='sm'
                title={template.description}
                onClick={() => {
                  loadSettings({
                    ...settings,
                    schema: structuredClone(template.schema),
                    tableName: template.id === 'products' ? 'products' : 'users',
                  })
                  setMode('fields')
                  setNotice(`${template.name} template loaded.`)
                }}
              >
                {template.name}
              </Button>
            ))}
          </div>
          <div className={`min-h-72 ${mode === 'code' ? 'p-5 md:p-7' : ''}`}>
            {mode === 'fields' ? (
              <FieldEditor
                key={revision}
                schema={settings.schema}
                onChange={setSchema}
                methods={fakerMethods}
                onValidityChange={setFieldsValid}
              />
            ) : (
              <Suspense fallback={<Skeleton className='h-80 w-full' />}>
                <SchemaCodeEditor
                  value={code}
                  methods={fakerMethods}
                  onChange={(next, schema) => {
                    setCode(next)
                    if (schema) setSchema(schema)
                  }}
                />
              </Suspense>
            )}
          </div>
          <div className='flex flex-wrap items-center justify-between gap-2 px-5 pb-5 text-xs text-muted-foreground md:px-7'>
            <span role='status' className='min-w-0 break-words'>
              {codeError ||
                (!fieldsValid
                  ? 'Resolve field errors before generating.'
                  : storageError
                    ? 'Draft could not be saved.'
                    : 'Draft saved in this browser.')}
            </span>
            <span>
              Generated emails use <code className='font-mono text-[11px]'>example.test</code>
            </span>
          </div>
        </section>
        <GenerationSettings
          format={format}
          settings={settings}
          locales={locales}
          isPending={generation.isPending}
          onChange={updateSettings}
          onGenerate={generate}
        />
        <DataPreview
          data={generation.data}
          format={format}
          isPending={generation.isPending}
          error={generation.error}
          stale={Boolean(generation.data !== undefined && submitted !== JSON.stringify(settings))}
        />
      </div>
    </div>
  )
}
