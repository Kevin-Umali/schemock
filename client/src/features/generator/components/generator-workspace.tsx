import { FieldEditor } from '@/components/schema/field-editor'
import { WorkspaceLayoutControls } from '@/components/layout/workspace-layout-controls'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { WORKSPACE_DESKTOP_MEDIA_QUERY } from '@/constants/workspace'
import { DataPreview } from '@/features/generator/components/data-preview'
import { GenerationSettings } from '@/features/generator/components/generation-settings'
import { ImportSchema, SchemaLibrary } from '@/features/generator/components/schema-library'
import { templates } from '@/features/generator/constants/templates'
import { useGenerator } from '@/features/generator/hooks/use-generator'
import type { EditorMode } from '@/features/generator/types/workspace'
import { isValidTableName } from '@/features/generator/utils/settings'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useWorkspaceLayout } from '@/hooks/use-workspace-layout'
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
  const previewRef = useRef<HTMLDivElement | null>(null)
  const layout = useWorkspaceLayout({ editor: 55, preview: 45 })
  const isDesktop = useMediaQuery(WORKSPACE_DESKTOP_MEDIA_QUERY)
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
        if (isDesktop) layout.show('editor')
        requestAnimationFrame(() => {
          const editor = schemaEditorRef.current
          const invalidField = editor?.querySelector<HTMLElement>('[aria-invalid="true"]')
          const target = invalidField ?? editor
          target?.focus()
        })
      }
      return
    }
    setNotice('')
    if (isDesktop) layout.show('preview')
    setSubmitted(JSON.stringify(settings))
    generation.mutate(settings, {
      onSettled: () =>
        requestAnimationFrame(() => {
          if (!isDesktop && document.activeElement === previewRef.current) {
            previewRef.current?.scrollIntoView({ block: 'start' })
          }
        }),
    })
    if (!isDesktop) {
      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({ block: 'start' })
        previewRef.current?.focus({ preventScroll: true })
      })
    }
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
    <div className='flex h-full min-h-0 flex-col overflow-hidden'>
      <header className='shrink-0 border-b border-border bg-card px-4 py-4 md:px-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-xl font-semibold tracking-tight'>
              {format === 'json' ? 'JSON generator' : format === 'csv' ? 'CSV export' : 'SQL statements'}
            </h1>
            <p className='mt-1 hidden text-xs text-muted-foreground sm:block'>
              Define a schema, then generate and inspect your data.
            </p>
          </div>
          <div className='flex flex-wrap gap-1 sm:gap-2 max-sm:[&>button]:px-2'>
            {isDesktop && (
              <WorkspaceLayoutControls
                panels={[
                  {
                    label: 'Editor',
                    side: 'left',
                    hidden: Boolean(layout.hidden.editor),
                    onToggle: () => layout.toggle('editor'),
                  },
                  {
                    label: 'Preview',
                    side: 'right',
                    hidden: Boolean(layout.hidden.preview),
                    onToggle: () => layout.toggle('preview'),
                  },
                ]}
                onReset={layout.reset}
              />
            )}
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
            <Button
              variant='outline'
              size='sm'
              className='max-sm:size-11 max-sm:p-0'
              onClick={share}
              disabled={!canGenerate}
            >
              <Share2 data-icon='inline-start' />
              <span className='sr-only sm:not-sr-only'>Share</span>
            </Button>
          </div>
        </div>
        {notice && (
          <Alert
            className='mt-3 flex items-center justify-between gap-3 py-2'
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
      </header>
      <GenerationSettings
        format={format}
        settings={settings}
        locales={locales}
        isPending={generation.isPending}
        onChange={updateSettings}
        onGenerate={generate}
      />
      <div className='min-h-0 flex-1 overflow-y-auto bg-card xl:overflow-hidden'>
        <ResizablePanelGroup
          groupRef={layout.groupRef}
          orientation='horizontal'
          disabled={!isDesktop}
          data-stacked={!isDesktop || undefined}
        >
          <ResizablePanel
            {...layout.panelProps('editor')}
            minSize={isDesktop ? '35%' : 0}
            collapsible={isDesktop}
            inert={isDesktop && layout.hidden.editor}
            className='overflow-hidden!'
          >
            <section
              ref={schemaEditorRef}
              tabIndex={-1}
              aria-label='Schema editor'
              className='min-w-0 border-b border-border outline-none xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-b-0'
            >
              <div className='flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 md:px-6'>
                <div className='flex items-center gap-3'>
                  <h2 className='font-semibold'>Schema</h2>
                  <span className='text-xs tabular-nums text-muted-foreground'>
                    {Object.keys(settings.schema).length}{' '}
                    {Object.keys(settings.schema).length === 1 ? 'root field' : 'root fields'}
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
                className='flex shrink-0 flex-wrap items-center gap-1 border-b bg-muted/35 px-4 py-2 md:px-6'
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
              <div
                className={`xl:min-h-0 xl:flex-1 ${mode === 'code' ? 'overflow-y-auto overscroll-contain p-4 md:p-6' : 'xl:overflow-hidden'}`}
              >
                {mode === 'fields' ? (
                  <FieldEditor
                    key={revision}
                    schema={settings.schema}
                    onChange={setSchema}
                    methods={fakerMethods}
                    onValidityChange={setFieldsValid}
                    fillHeight={isDesktop}
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
              <div className='flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground md:px-6'>
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
          </ResizablePanel>
          <ResizableHandle
            withHandle
            aria-label='Resize editor and preview'
            disabled={!isDesktop}
            className={isDesktop ? '' : 'hidden'}
          />
          <ResizablePanel
            {...layout.panelProps('preview')}
            minSize={isDesktop ? '25%' : 0}
            collapsible={isDesktop}
            inert={isDesktop && layout.hidden.preview}
            className='overflow-hidden!'
          >
            <div
              ref={previewRef}
              tabIndex={-1}
              className='min-w-0 outline-none xl:h-full xl:min-h-0 xl:overflow-hidden'
            >
              <DataPreview
                data={generation.data}
                format={format}
                isPending={generation.isPending}
                error={generation.error}
                stale={Boolean(generation.data !== undefined && submitted !== JSON.stringify(settings))}
                onEditSchema={() => {
                  schemaEditorRef.current?.scrollIntoView({ block: 'start' })
                  schemaEditorRef.current?.focus({ preventScroll: true })
                }}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
