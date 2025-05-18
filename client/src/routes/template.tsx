import Spinner from '@/components/custom/spinner'
import TipTapEditor from '@/components/custom/tiptap-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { Share2, Loader2, Braces, Check, Copy } from 'lucide-react'
import LZString from 'lz-string'
import { useState, useCallback } from 'react'
import { z } from 'zod'
import { useGenerateTemplateWithOptions } from '@/api/mutations'
import { type GenerateLocale } from '@server/schema/generate.schema'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createFormatHeaders } from '@/lib/headers'

const templateSearchSchema = z.object({
  t: fallback(z.string(), '').optional().default(''),
  c: fallback(z.number().min(1).max(100), 1).optional().default(1),
  l: fallback(z.string(), 'en').optional().default('en'),
  f: fallback(z.boolean(), true).optional().default(true), // format objects as paragraphs
})

export const Route = createFileRoute('/template')({
  validateSearch: zodValidator(templateSearchSchema),
  component: Template,
  pendingComponent: () => (
    <div className='flex items-center justify-center'>
      <Spinner show text='Loading...' />
    </div>
  ),
  pendingMinMs: 3000,
  pendingMs: 10,
})

function Template() {
  const { t: compressedTemplate, c: count, l: locale, f: formatObjects } = Route.useSearch()
  const isRouteLoading = useRouterState().isLoading
  const { locales, fakerMethods } = Route.useRouteContext()

  const navigate = useNavigate({ from: Route.fullPath })

  const [copiedText, copy] = useCopyToClipboard()

  const [templateContent, setTemplateContent] = useState<string>(() => {
    if (!compressedTemplate) return ''

    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(compressedTemplate)
      return decompressed ?? ''
    } catch (error) {
      console.error('Failed to decompress template:', error)
      return ''
    }
  })
  const [isDirty, setIsDirty] = useState(false)
  const [generatedResults, setGeneratedResults] = useState<string[]>([])

  const { mutate: generateTemplate, isPending: isGenerating } = useGenerateTemplateWithOptions()

  const setCount = useCallback(
    (value: number) => {
      navigate({
        search: (prev) => ({
          ...prev,
          c: value,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const setLocale = useCallback(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          l: value,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const setFormatObjects = useCallback(
    (value: boolean) => {
      navigate({
        search: (prev) => ({
          ...prev,
          f: value,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value)
      setCount(value > 0 && value <= 100 ? value : 1)
    },
    [setCount],
  )

  const handleTemplateChange = useCallback((content: string) => {
    setTemplateContent(content)
    setIsDirty(true)
  }, [])

  const handleShare = useCallback(async () => {
    if (isDirty && templateContent) {
      const compressed = LZString.compressToEncodedURIComponent(templateContent)
      await navigate({
        search: (prev) => ({
          ...prev,
          t: compressed,
        }),
        replace: true,
      })
      setIsDirty(false)
    }
    await copy(window.location.href)
  }, [copy, isDirty, navigate, templateContent])

  const handleGenerateTemplate = useCallback(() => {
    if (!templateContent) return

    // Create headers for formatting objects
    const headers = createFormatHeaders(formatObjects)

    generateTemplate(
      {
        template: templateContent,
        count,
        locale: locale as GenerateLocale,
        headers,
      },
      {
        onSuccess: (data) => {
          setGeneratedResults(data)
        },
      },
    )
  }, [count, generateTemplate, locale, templateContent, formatObjects])

  const handleCopyResult = useCallback(
    async (result: string) => {
      await copy(result)
    },
    [copy],
  )

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      {isRouteLoading ? (
        <div className='flex min-h-[50vh] items-center justify-center'>
          <Spinner show text='Loading template editor' />
        </div>
      ) : (
        <>
          <div className='border rounded-lg p-4 mb-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Template Generator</h2>
            <div className='flex flex-wrap items-center gap-4 mb-4'>
              {/* Count Input */}
              <div className='flex items-center gap-2'>
                <label htmlFor='count' className='text-sm font-medium text-gray-700'>
                  Count:
                </label>
                <Input
                  id='count'
                  type='number'
                  min={1}
                  max={100}
                  value={count ?? 1}
                  onChange={handleCountChange}
                  className='w-24 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Locale Selector */}
              <div className='flex items-center gap-2'>
                <label htmlFor='locale' className='text-sm font-medium text-gray-700'>
                  Locale:
                </label>
                <Select value={locale ?? 'en'} onValueChange={setLocale}>
                  <SelectTrigger className='w-40 transition-all duration-200 ease-in-out hover:border-blue-500'>
                    <SelectValue placeholder='Select Locale' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {locales.map((loc: string) => (
                        <SelectItem key={loc} value={loc} className='transition-colors duration-150 ease-in-out hover:bg-blue-50'>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Objects Toggle */}
              <div className='flex items-center gap-2'>
                <div className='flex items-center space-x-2'>
                  <Switch id='format-objects' checked={formatObjects} onCheckedChange={setFormatObjects} />
                  <Label htmlFor='format-objects' className='text-sm font-medium text-gray-700'>
                    Format objects as paragraphs
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='ml-auto flex items-center gap-2'>
                <Button onClick={handleShare} variant='outline' className='transition-all duration-200 ease-in-out hover:shadow-md'>
                  <Share2 className='w-4 h-4 mr-2' />
                  {isDirty ? 'Save & Share Template' : 'Share Template'}
                </Button>
                <Button
                  onClick={handleGenerateTemplate}
                  variant='default'
                  disabled={Boolean(isGenerating) || templateContent === ''}
                  className={cn('transition-all hover:shadow-md', isGenerating && 'opacity-70')}
                >
                  {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Braces className='mr-2 h-4 w-4' />}
                  Generate Template
                </Button>
              </div>
            </div>

            <div className='mt-4'>
              <label htmlFor='template-editor' className='block text-sm font-medium text-gray-700 mb-2'>
                Template (Use &#123;&#123;faker.method&#125;&#125; syntax to insert dynamic content):
              </label>
              <div id='template-editor'>
                <TipTapEditor onChange={handleTemplateChange} initialContent={templateContent} fakerMethods={fakerMethods} />
              </div>
              <p className='mt-2 text-xs text-gray-500'>
                Type / to insert a faker method. Example: "Hello, my name is &#123;&#123;person.firstName&#125;&#125; &#123;&#123;person.lastName&#125;&#125;."
              </p>
            </div>
          </div>

          {/* Generated Results */}
          {generatedResults.length > 0 && (
            <div className='border rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Generated Results</h2>
              <div className='space-y-4'>
                {generatedResults.map((result, index) => (
                  <div key={`result-${index}-${result.substring(0, 10)}`} className='bg-gray-50 p-4 rounded-md relative group'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleCopyResult(result)}
                      className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      {copiedText === result ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
                    </Button>
                    <p className='pr-8'>{result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
