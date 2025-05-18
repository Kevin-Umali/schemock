import { useCallback, useState } from 'react'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Braces, Check, Copy, Download, Loader2, Share2 } from 'lucide-react'
import Spinner from '@/components/custom/spinner'
import { cn } from '@/lib/utils'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { useGenerateCSVWithOptions } from '@/api/mutations'
import { type GenerateLocale } from '@server/schema/generate.schema'
import { Textarea } from '@/components/ui/textarea'
import SchemaBuilder from '@/components/custom/schema-builder'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createFlattenHeaders } from '@/lib/headers'

const csvSearchSchema = z.object({
  s: fallback(z.string(), '').optional().default(''),
  c: fallback(z.number().min(1).max(100), 1).optional().default(1),
  l: fallback(z.string(), 'en').optional().default('en'),
  f: fallback(z.boolean(), false).optional().default(false), // flatten complex objects
})

export const Route = createFileRoute('/csv')({
  validateSearch: zodValidator(csvSearchSchema),
  component: CSV,
  pendingComponent: () => (
    <div className='flex items-center justify-center'>
      <Spinner show text='Loading...' />
    </div>
  ),
  pendingMinMs: 3000,
  pendingMs: 10,
})

function CSV() {
  const { s: compressedSchema, c: count, l: locale, f: flattenObjects } = Route.useSearch()
  const isRouteLoading = useRouterState().isLoading
  const { locales, fakerMethods } = Route.useRouteContext()

  const navigate = useNavigate({ from: Route.fullPath })
  const [copiedText, copy] = useCopyToClipboard()
  const [schemaInput, setSchemaInput] = useState<string>(() => {
    try {
      return compressedSchema ? compressedSchema : JSON.stringify({ name: 'person.firstName', email: 'internet.email' }, null, 2)
    } catch (error) {
      return JSON.stringify({ name: 'person.firstName', email: 'internet.email' }, null, 2)
    }
  })
  const [schemaError, setSchemaError] = useState<string | null>(null)
  const [schemaMode, setSchemaMode] = useState<'builder' | 'json'>('builder')
  const [schemaObject, setSchemaObject] = useState<Record<string, string>>(() => {
    try {
      return compressedSchema ? JSON.parse(compressedSchema) : { name: 'person.firstName', email: 'internet.email' }
    } catch (error) {
      return { name: 'person.firstName', email: 'internet.email' }
    }
  })

  const { mutate: generateCSV, data: generatedCSV, error: generationError, isPending: isGenerating } = useGenerateCSVWithOptions()

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

  const setFlattenObjects = useCallback(
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

  const handleSchemaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchemaInput(e.target.value)
    setSchemaError(null)

    try {
      const parsed = JSON.parse(e.target.value)
      setSchemaObject(parsed)
    } catch (error) {
      // Ignore parse errors while typing
    }
  }, [])

  const handleSchemaObjectChange = useCallback((newSchema: Record<string, string>) => {
    setSchemaObject(newSchema)
    setSchemaInput(JSON.stringify(newSchema, null, 2))
    setSchemaError(null)
  }, [])

  const handleGenerateCSV = useCallback(() => {
    try {
      const schema = schemaMode === 'json' ? JSON.parse(schemaInput) : schemaObject

      // Create headers for flattening objects
      const headers = createFlattenHeaders(flattenObjects)

      generateCSV({
        schema,
        count,
        locale: locale as GenerateLocale,
        headers,
      })
    } catch (error) {
      setSchemaError('Invalid JSON schema')
    }
  }, [generateCSV, schemaInput, schemaObject, schemaMode, count, locale, flattenObjects])

  const handleCopy = useCallback(async () => {
    if (generatedCSV) {
      await copy(generatedCSV)
    }
  }, [copy, generatedCSV])

  const handleDownload = useCallback(() => {
    if (generatedCSV) {
      const blob = new Blob([generatedCSV], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated_data.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [generatedCSV])

  const handleShare = useCallback(async () => {
    try {
      const schema = JSON.parse(schemaInput)
      await navigate({
        search: (prev) => ({
          ...prev,
          s: JSON.stringify(schema),
        }),
        replace: true,
      })
      await copy(window.location.href)
    } catch (error) {
      setSchemaError('Invalid JSON schema')
    }
  }, [navigate, schemaInput, copy])

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      {isRouteLoading ? (
        <div className='flex min-h-[50vh] items-center justify-center'>
          <Spinner show text='Loading CSV generator' />
        </div>
      ) : (
        <>
          {/* Control Panel */}
          <div className='border rounded-lg p-4 mb-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>CSV Generator</h2>
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

              {/* Flatten Objects Toggle */}
              <div className='flex items-center gap-2'>
                <div className='flex items-center space-x-2'>
                  <Switch id='flatten-objects' checked={flattenObjects} onCheckedChange={setFlattenObjects} />
                  <Label htmlFor='flatten-objects' className='text-sm font-medium text-gray-700'>
                    Flatten complex objects
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='ml-auto flex items-center gap-2'>
                <Button onClick={handleShare} variant='outline' className='transition-all duration-200 ease-in-out hover:shadow-md'>
                  <Share2 className='w-4 h-4 mr-2' />
                  Share
                </Button>
                <Button
                  onClick={handleGenerateCSV}
                  variant='default'
                  disabled={isGenerating}
                  className={cn('transition-all hover:shadow-md', isGenerating && 'opacity-70')}
                >
                  {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Braces className='mr-2 h-4 w-4' />}
                  Generate CSV
                </Button>
              </div>
            </div>

            {/* Schema Input */}
            <div className='mt-4'>
              <div className='flex justify-between items-center mb-2'>
                <label htmlFor='schema' className='block text-sm font-medium text-gray-700'>
                  Schema:
                </label>
                <Tabs value={schemaMode} onValueChange={(value) => setSchemaMode(value as 'builder' | 'json')}>
                  <TabsList>
                    <TabsTrigger value='builder'>Visual Builder</TabsTrigger>
                    <TabsTrigger value='json'>JSON</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className={cn(schemaError && 'border-red-500 rounded-md')}>
                {schemaMode === 'builder' ? (
                  <SchemaBuilder initialSchema={schemaObject} onChange={handleSchemaObjectChange} fakerMethods={fakerMethods} />
                ) : (
                  <Textarea
                    id='schema'
                    value={schemaInput}
                    onChange={handleSchemaChange}
                    className={cn('font-mono text-sm min-h-[150px]')}
                    placeholder='Enter your schema as JSON...'
                  />
                )}
              </div>

              {schemaError && <p className='mt-1 text-sm text-red-500'>{schemaError}</p>}
            </div>
          </div>

          {/* Generated CSV Output */}
          {generatedCSV && (
            <div className='border rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold text-gray-900'>Generated CSV</h2>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleCopy}
                    className='flex items-center gap-2 relative w-24 justify-center transition-all duration-200 ease-in-out hover:shadow-md'
                  >
                    {/* Copied State */}
                    <div
                      className={cn(
                        'flex items-center gap-2 absolute transition-all duration-300 ease-in-out transform',
                        copiedText ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                      )}
                    >
                      <Check className='w-4 h-4 text-emerald-500' />
                      <span className='text-emerald-500 text-sm'>Copied!</span>
                    </div>
                    {/* Copy Button */}
                    <div
                      className={cn(
                        'flex items-center gap-2 absolute transition-all duration-300 ease-in-out transform',
                        copiedText ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
                      )}
                    >
                      <Copy className='w-4 h-4' />
                      <span className='text-sm'>Copy</span>
                    </div>
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleDownload}
                    className='flex items-center gap-2 transition-all duration-200 ease-in-out hover:shadow-md'
                  >
                    <Download className='w-4 h-4' />
                    <span className='text-sm'>Download</span>
                  </Button>
                </div>
              </div>
              <pre className='bg-gray-50 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap'>{generatedCSV}</pre>
            </div>
          )}

          {/* Error Display */}
          {generationError && (
            <div className='border border-red-200 bg-red-50 rounded-lg p-4 mt-4'>
              <h3 className='text-red-800 font-medium'>Error</h3>
              <p className='text-red-600 text-sm'>{generationError instanceof Error ? generationError.message : 'An error occurred'}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
