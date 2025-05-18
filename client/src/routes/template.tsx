import Spinner from '@/components/custom/spinner'
import TemplateEditor from '@/components/custom/template-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@radix-ui/react-select'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { Share2, Loader2, Braces } from 'lucide-react'
import LZString from 'lz-string'
import { useState, useCallback } from 'react'
import { z } from 'zod'

const templateSearchSchema = z.object({
  t: fallback(z.string(), '').optional().default(''),
  c: fallback(z.number().min(1).max(100), 1).optional().default(1),
  l: fallback(z.string(), 'en').optional().default('en'),
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
  const { t: compressedTemplates, c: count, l: locale } = Route.useSearch()
  const isRouteLoading = useRouterState().isLoading
  const { locales, fakerMethods } = Route.useRouteContext()

  const navigate = useNavigate({ from: Route.fullPath })

  const [copiedText, copy] = useCopyToClipboard()

  const [isDirty, setIsDirty] = useState(false)
  const isGenerating = false

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

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value)
      setCount(value > 0 && value <= 100 ? value : 1)
    },
    [setCount],
  )

  const handleShare = async () => {
    if (isDirty) {
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(localNodes))
      await navigate({
        search: (prev) => ({
          ...prev,
          s: compressed,
        }),
        replace: true,
      })
      setIsDirty(false)
    }
    await copy(window.location.href)
  }

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      {isRouteLoading ? (
        <div className='flex min-h-[50vh] items-center justify-center'>
          <Spinner show text='Loading schema' />
        </div>
      ) : (
        <div className='border rounded-lg p-4 mb-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md'>
          <div className='flex flex-wrap items-center gap-4'>
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
                    {locales.map((loc) => (
                      <SelectItem key={loc} value={loc} className='transition-colors duration-150 ease-in-out hover:bg-blue-50'>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className='ml-auto flex items-center gap-2'>
              <Button onClick={handleShare} variant='outline' className='transition-all duration-200 ease-in-out hover:shadow-md'>
                <Share2 className='w-4 h-4 mr-2' />
                {isDirty ? 'Save & Share Schema' : 'Share Schema'}
              </Button>
              <Button
                onClick={() => console.log('Generate Template')}
                variant='default'
                disabled={isGenerating}
                className={cn('transition-all hover:shadow-md', isGenerating && 'opacity-70')}
              >
                {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Braces className='mr-2 h-4 w-4' />}
                Generate Template
              </Button>
            </div>
          </div>
        </div>
      )}
      <TemplateEditor fakerMethods={fakerMethods} />
    </div>
  )
}
