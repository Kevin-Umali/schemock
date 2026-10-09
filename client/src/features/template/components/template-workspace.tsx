import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { Field, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Empty, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import TemplateEditor from '@/features/template/components/template-editor'
import { useGenerateTemplateWithOptions } from '@/features/template/hooks/use-generate-template'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { downloadText } from '@/utils/download'
import { createTemplateShareUrl, getTemplateLocaleOptions, readTemplateConfiguration } from '../utils/config'
import { TEMPLATE_CHARACTER_LIMIT } from '../constants/config'
import { useRouteContext } from '@tanstack/react-router'
import { ArrowRight, Check, Copy, Download, Share2 } from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'
export const TemplateWorkspace: React.FC = () => {
  const { locales, fakerMethods } = useRouteContext({ from: '__root__' })
  const [initial] = useState(() => readTemplateConfiguration(window.location.search))
  const [template, setTemplate] = useState(initial.template)
  const [count, setCount] = useState(initial.count)
  const [locale, setLocale] = useState(initial.locale)
  const [formatObjects, setFormatObjects] = useState(initial.formatObjects)
  const [notice, setNotice] = useState('')
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
  const share = async () => {
    setNotice(
      (await copy(createTemplateShareUrl(window.location.href, { template, count, locale, formatObjects })))
        ? 'Template link copied.'
        : 'Could not copy the link. Check clipboard permissions.',
    )
  }
  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10'>
      <div className='flex items-start justify-between gap-6'>
        <div>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>Put your data into words.</h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-muted-foreground'>
            Write a template with {'{{faker.method}}'} placeholders. Generate emails, descriptions, and sample content.
          </p>
        </div>
      </div>
      {notice && (
        <p role='status' className='my-3 text-sm text-muted-foreground'>
          {notice}
        </p>
      )}
      <div className='mt-8 grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'>
        <section className='min-w-0 overflow-hidden rounded-lg border border-border bg-card'>
          <div className='flex min-h-14 items-center justify-between gap-3 border-b border-border px-5 py-4'>
            <h2 className='text-base font-semibold'>Your template</h2>
            <span className='text-xs tabular-nums text-muted-foreground'>
              {template.length} / {TEMPLATE_CHARACTER_LIMIT.toLocaleString()}
            </span>
          </div>
          <div className='min-h-96 p-4 sm:p-5'>
            <TemplateEditor initialContent={initial.template} onChange={setTemplate} fakerMethods={fakerMethods} />
          </div>
          <div className='border-t border-border bg-muted/40 p-4 sm:p-5'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.5fr]'>
              <Field name='template-count' className='gap-1.5 text-sm'>
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
              <Field name='template-locale' className='gap-1.5 text-sm'>
                <FieldLabel>Locale</FieldLabel>
                <SearchSelect
                  value={locale}
                  options={getTemplateLocaleOptions(locales)}
                  onChange={setLocale}
                  label='Locale'
                />
              </Field>
            </div>
            <Field name='format-objects' orientation='horizontal' className='mt-4 items-center gap-2'>
              <Checkbox checked={formatObjects} onCheckedChange={(checked) => setFormatObjects(checked === true)} />
              <FieldLabel>Format objects as readable text</FieldLabel>
            </Field>
            {!valid && (
              <Alert variant='destructive'>
                <AlertDescription>
                  Use a non-empty template under 10,000 characters, 1–100 variations, and a supported locale.
                </AlertDescription>
              </Alert>
            )}
            <div className='mt-4 flex gap-2'>
              <Button
                className='min-h-11 flex-1 justify-center'
                disabled={!valid || generation.isPending}
                onClick={() =>
                  generation.mutate({ template, count, locale, headers: { 'X-Format-Objects': String(formatObjects) } })
                }
              >
                {generation.isPending ? 'Generating…' : 'Generate text'}
                <ArrowRight size={16} />
              </Button>
              <Button variant='outline' size='icon' aria-label='Share template' onClick={share}>
                <Share2 size={16} />
              </Button>
            </div>
          </div>
        </section>
        <section className='min-w-0 overflow-hidden rounded-lg border border-border bg-card'>
          <div className='flex min-h-14 items-center justify-between gap-3 border-b border-border px-5 py-4'>
            <h2 className='text-base font-semibold'>Generated text</h2>
            {output && (
              <div className='flex gap-1'>
                <Button variant='ghost' size='icon' aria-label='Copy generated text' onClick={() => copy(output)}>
                  {copied === output ? <Check size={17} /> : <Copy size={17} />}
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Download generated text'
                  onClick={() => downloadText(output, 'schemock-template.txt', 'text/plain')}
                >
                  <Download size={17} />
                </Button>
              </div>
            )}
          </div>
          {generation.error && (
            <Alert variant='destructive' className='m-3 w-auto'>
              <AlertDescription>{generation.error.message}</AlertDescription>
            </Alert>
          )}
          {generation.isPending ? (
            <div role='status' aria-label='Generating text' className='space-y-3 p-6'>
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </div>
          ) : generation.data ? (
            <div className='divide-y divide-border'>
              {generation.data.map((result, index) => (
                <article key={index} className='space-y-2 p-6'>
                  <span className='text-xs font-medium text-muted-foreground'>Variation {index + 1}</span>
                  <p className='break-words whitespace-pre-wrap text-sm leading-7'>{result}</p>
                </article>
              ))}
            </div>
          ) : (
            <Empty className='min-h-72 px-6 py-8'>
              <EmptyTitle>Generate to preview text</EmptyTitle>
              <EmptyDescription>
                Your generated variations will appear here.
                <br />
                Copy or download them when you’re ready.
              </EmptyDescription>
            </Empty>
          )}
        </section>
      </div>
    </div>
  )
}
