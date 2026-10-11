import { Button } from '@/components/ui/button'
import { WorkspaceLayoutControls } from '@/components/layout/workspace-layout-controls'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { Field, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Empty, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { WORKSPACE_DESKTOP_MEDIA_QUERY } from '@/constants/workspace'
import TemplateEditor from '@/features/template/components/template-editor'
import { useGenerateTemplateWithOptions } from '@/features/template/hooks/use-generate-template'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useWorkspaceLayout } from '@/hooks/use-workspace-layout'
import { downloadText } from '@/utils/download'
import { createTemplateShareUrl, getTemplateLocaleOptions, readTemplateConfiguration } from '../utils/config'
import { TEMPLATE_CHARACTER_LIMIT } from '../constants/config'
import { useRouteContext } from '@tanstack/react-router'
import { ArrowLeft, Check, Copy, Download, LoaderCircle, Play, Share2, SlidersHorizontal, X } from 'lucide-react'
import type * as React from 'react'
import { useRef, useState } from 'react'
export const TemplateWorkspace: React.FC = () => {
  const { locales, fakerMethods } = useRouteContext({ from: '__root__' })
  const [initial] = useState(() => readTemplateConfiguration(window.location.search))
  const [template, setTemplate] = useState(initial.template)
  const [count, setCount] = useState(initial.count)
  const [locale, setLocale] = useState(initial.locale)
  const [formatObjects, setFormatObjects] = useState(initial.formatObjects)
  const [notice, setNotice] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [submitted, setSubmitted] = useState('')
  const editorRef = useRef<HTMLElement | null>(null)
  const previewRef = useRef<HTMLElement | null>(null)
  const isMobile = useIsMobile()
  const isDesktop = useMediaQuery(WORKSPACE_DESKTOP_MEDIA_QUERY)
  const layout = useWorkspaceLayout({ editor: 50, preview: 50 })
  const [copied, copy] = useCopyToClipboard()
  const generation = useGenerateTemplateWithOptions()
  const valid =
    Boolean(template.trim()) &&
    template.length <= TEMPLATE_CHARACTER_LIMIT &&
    Number.isInteger(count) &&
    count >= 1 &&
    count <= 100 &&
    locales.includes(locale)
  const output = generation.data?.join('\n\n') ?? ''
  const snapshot = JSON.stringify({ template, count, locale, formatObjects })
  const generate = () => {
    if (isDesktop) layout.show('preview')
    setSubmitted(snapshot)
    generation.mutate(
      { template, count, locale, headers: { 'X-Format-Objects': String(formatObjects) } },
      {
        onSettled: () =>
          requestAnimationFrame(() => {
            if (!isDesktop && document.activeElement === previewRef.current) {
              previewRef.current?.scrollIntoView({ block: 'start' })
            }
          }),
      },
    )
    if (!isDesktop) {
      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({ block: 'start' })
        previewRef.current?.focus({ preventScroll: true })
      })
    }
  }
  const share = async () => {
    setNotice(
      (await copy(createTemplateShareUrl(window.location.href, { template, count, locale, formatObjects })))
        ? 'Template link copied.'
        : 'Could not copy the link. Check clipboard permissions.',
    )
  }
  return (
    <div className='flex h-full min-h-0 flex-col overflow-hidden'>
      <header className='shrink-0 border-b border-border bg-card px-4 py-4 md:px-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-xl font-semibold tracking-tight'>Text templates</h1>
            <p className='mt-1 hidden text-xs text-muted-foreground sm:block'>
              Write with {'{{faker.method}}'} placeholders, then generate and inspect your text.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
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
            <Button variant='outline' size='sm' className='max-sm:size-11 max-sm:p-0' disabled={!valid} onClick={share}>
              <Share2 data-icon='inline-start' />
              <span className='sr-only sm:not-sr-only'>Share template</span>
            </Button>
          </div>
        </div>
        {notice && (
          <Alert className='mt-3 flex items-center justify-between gap-3 py-2'>
            <AlertDescription>{notice}</AlertDescription>
            <Button variant='ghost' size='icon' aria-label='Dismiss message' onClick={() => setNotice('')}>
              <X />
            </Button>
          </Alert>
        )}
      </header>
      <Collapsible
        render={<section />}
        aria-label='Generation settings'
        open={!isMobile || settingsOpen}
        onOpenChange={setSettingsOpen}
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
              {count} {count === 1 ? 'variation' : 'variations'} · {locale}
            </span>
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className='col-span-2 row-start-2 flex min-w-0 flex-wrap items-end gap-x-5 gap-y-3 md:col-span-1 md:row-start-1'>
          <Field name='template-count' className='w-24 shrink-0'>
            <FieldLabel htmlFor='template-count'>Variations</FieldLabel>
            <Input
              id='template-count'
              type='number'
              min={1}
              max={100}
              value={count || ''}
              onChange={(event) => setCount(Number(event.target.value))}
            />
          </Field>
          <Field name='template-locale' className='min-w-44 flex-1 md:max-w-64'>
            <FieldLabel htmlFor='template-locale'>Locale</FieldLabel>
            <SearchSelect
              id='template-locale'
              value={locale}
              options={getTemplateLocaleOptions(locales)}
              onChange={setLocale}
              label='Locale'
            />
          </Field>
          <Field name='format-objects' orientation='horizontal' className='w-auto items-center gap-2 py-2'>
            <Checkbox
              id='format-template-objects'
              checked={formatObjects}
              onCheckedChange={(checked) => setFormatObjects(checked === true)}
            />
            <FieldLabel htmlFor='format-template-objects'>Format objects as readable text</FieldLabel>
          </Field>
        </CollapsibleContent>
        <Button
          className='col-start-2 row-start-1 min-h-11 md:min-w-44'
          disabled={!valid || generation.isPending}
          onClick={generate}
        >
          {generation.isPending ? (
            <LoaderCircle data-icon='inline-start' className='animate-spin motion-reduce:animate-none' />
          ) : (
            <Play data-icon='inline-start' />
          )}
          {generation.isPending ? 'Generating…' : 'Generate text'}
        </Button>
      </Collapsible>
      {!valid && (
        <Alert variant='destructive' className='shrink-0 rounded-none border-x-0 border-t-0 px-4 py-2 md:px-6'>
          <AlertDescription>
            Use a non-empty template under 10,000 characters, 1–100 variations, and a supported locale.
          </AlertDescription>
        </Alert>
      )}
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
              ref={editorRef}
              tabIndex={-1}
              aria-label='Template editor'
              className='min-w-0 border-b border-border outline-none xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-b-0'
            >
              <div className='flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6'>
                <h2 className='text-sm font-semibold'>Template</h2>
                <span className='text-xs tabular-nums text-muted-foreground'>
                  {template.length} / {TEMPLATE_CHARACTER_LIMIT.toLocaleString()}
                </span>
              </div>
              <div className='p-4 md:p-6 xl:min-h-0 xl:flex-1 xl:overflow-hidden'>
                <TemplateEditor initialContent={initial.template} onChange={setTemplate} fakerMethods={fakerMethods} />
              </div>
            </section>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            aria-label='Resize template and preview'
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
            <section
              ref={previewRef}
              tabIndex={-1}
              aria-label='Generated text'
              aria-busy={generation.isPending}
              className='flex min-w-0 flex-col overflow-hidden outline-none xl:h-full xl:min-h-0'
            >
              <div className='flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6'>
                <h2 className='text-sm font-semibold'>Generated text</h2>
                <div className='flex gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='xl:hidden'
                    aria-label='Back to template'
                    onClick={() => {
                      editorRef.current?.scrollIntoView({ block: 'start' })
                      editorRef.current?.focus({ preventScroll: true })
                    }}
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    disabled={!output || generation.isPending}
                    aria-label='Copy generated text'
                    onClick={() => copy(output)}
                  >
                    {copied === output ? <Check size={17} /> : <Copy size={17} />}
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Download generated text'
                    disabled={!output || generation.isPending}
                    onClick={() => downloadText(output, 'schemock-template.txt', 'text/plain')}
                  >
                    <Download size={17} />
                  </Button>
                </div>
              </div>
              {generation.error && (
                <Alert variant='destructive' className='m-3 w-auto shrink-0'>
                  <AlertDescription>{generation.error.message}</AlertDescription>
                </Alert>
              )}
              {generation.data && submitted !== snapshot && (
                <Alert className='m-3 w-auto shrink-0 py-2'>
                  <AlertDescription>
                    Template or settings changed. Generate again to refresh this output.
                  </AlertDescription>
                </Alert>
              )}
              {generation.isPending ? (
                <div
                  role='status'
                  aria-label='Generating text'
                  className='min-h-72 space-y-3 overflow-auto p-6 xl:min-h-0 xl:flex-1'
                >
                  <Skeleton className='h-4 w-1/3' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                </div>
              ) : generation.data ? (
                <div className='max-h-[36rem] divide-y divide-border overflow-auto xl:min-h-0 xl:max-h-none xl:flex-1 xl:overscroll-contain'>
                  {generation.data.map((result, index) => (
                    <article key={index} className='space-y-2 p-6'>
                      <span className='text-xs font-medium text-muted-foreground'>Variation {index + 1}</span>
                      <p className='break-words whitespace-pre-wrap text-sm leading-7'>{result}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <Empty className='min-h-72 px-6 py-8 xl:min-h-0 xl:flex-1'>
                  <EmptyTitle>Generate to preview text</EmptyTitle>
                  <EmptyDescription>
                    Your generated variations will appear here.
                    <br />
                    Copy or download them when you’re ready.
                  </EmptyDescription>
                </Empty>
              )}
              <div className='flex shrink-0 items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground md:px-6'>
                <span>
                  {generation.data
                    ? `${generation.data.length} ${generation.data.length === 1 ? 'variation' : 'variations'}`
                    : 'Waiting for a run'}
                </span>
                <span>TEXT</span>
              </div>
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
