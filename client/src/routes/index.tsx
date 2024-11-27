import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TreeDataNode } from '@/types/tree'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { INITIAL_SCHEMA } from '@/constants'
import { convertToSchema } from '@/lib/schema'
import TreeView from '@/components/custom/tree-view'
import { Button } from '@/components/ui/button'
import { Braces, Check, Copy, Download, Loader2, Plus, Share2 } from 'lucide-react'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import LZString from 'lz-string'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import Spinner from '@/components/custom/spinner'
import SchemaTabs, { type GenericTab } from '@/components/custom/schema-tabs'
import { useGenerateJSON } from '@/api/mutations'
import { type GenerateBodyJSON } from '@server/schema/generate.schema'
import AnimatedJSON from '@/components/custom/animated-json'

const generateSearchSchema = z.object({
  s: fallback(z.string(), '').optional().default(''),
  c: fallback(z.number().min(1).max(100), 1).optional().default(1),
  l: fallback(z.string(), 'en').optional().default('en'),
})

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(generateSearchSchema),
  component: Index,
  pendingComponent: () => (
    <div className='flex items-center justify-center'>
      <Spinner show text='Loading...' />
    </div>
  ),
  pendingMinMs: 3000,
  pendingMs: 10,
})

function Index() {
  const { s: compressedNodes, c: count, l: locale } = Route.useSearch()
  const isRouteLoading = useRouterState().isLoading
  const { locales } = Route.useRouteContext()

  const navigate = useNavigate({ from: Route.fullPath })

  const [copiedText, copy] = useCopyToClipboard()
  const idCounter = useRef(7) // Start after initial schema IDs

  const [isDirty, setIsDirty] = useState(false)
  const [localNodes, setLocalNodes] = useState<TreeDataNode[]>(() => {
    if (compressedNodes) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(compressedNodes)
        return decompressed ? JSON.parse(decompressed) : INITIAL_SCHEMA
      } catch (error) {
        console.error('Failed to decode nodes from URL:', error)
        return INITIAL_SCHEMA
      }
    }
    return INITIAL_SCHEMA
  })

  const { mutate: generateJSON, data: generatedData, error: generationError, isPending: isGenerating } = useGenerateJSON()

  useEffect(() => {
    if (compressedNodes) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(compressedNodes)
        if (decompressed) {
          const nodes = JSON.parse(decompressed)
          setLocalNodes(nodes)
          setIsDirty(false) // Reset dirty state when URL updates
        }
      } catch (error) {
        console.error('Failed to decode nodes from URL:', error)
      }
    }
  }, [compressedNodes])

  const setNodes = useCallback(
    (newNodes: TreeDataNode[] | ((prev: TreeDataNode[]) => TreeDataNode[])) => {
      const updatedNodes = typeof newNodes === 'function' ? newNodes(localNodes) : newNodes
      setLocalNodes(updatedNodes)
      setIsDirty(true) // Mark as dirty when nodes change
    },
    [localNodes],
  )

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

  const generatedSchema = useMemo(
    () => ({
      ...convertToSchema(localNodes),
      count,
      locale,
    }),
    [localNodes, count, locale],
  )

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value)
      setCount(value > 0 && value <= 100 ? value : 1)
    },
    [setCount],
  )

  const handleCopy = useCallback(async () => {
    const schemaString = JSON.stringify(generatedSchema, null, 2)
    await copy(schemaString)
  }, [copy, generatedSchema])

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

  const addRootNode = () => {
    idCounter.current += 1
    setNodes((prev) => [
      ...prev,
      {
        id: `node-${idCounter.current}`,
        label: 'newRoot',
        dataType: 'object',
        isRootNode: false,
        children: [],
      },
    ])
  }

  const handleGenerateJSON = useCallback(() => {
    generateJSON(generatedSchema as GenerateBodyJSON)
  }, [generateJSON, generatedSchema])

  const tabs = useMemo(
    () => [
      {
        value: 'schemaBuilder' as GenericTab,
        label: 'Schema Builder',
        content: (
          <div className='border rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Schema Builder</h2>
            <div className='transition-all duration-300 ease-in-out'>
              <TreeView nodes={localNodes} onChange={setNodes} allowAdd allowDelete defaultExpanded />
            </div>
          </div>
        ),
      },
      {
        value: 'generatedSchema' as GenericTab,
        label: 'Generated Schema',
        content: (
          <div className='border rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>Generated Schema</h2>
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
            </div>
            <pre className={cn('bg-gray-50 p-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-inner')}>
              {JSON.stringify(generatedSchema, null, 2)}
            </pre>
          </div>
        ),
      },
      // Add more tabs here if needed
    ],
    [localNodes, setNodes, handleCopy, generatedSchema, copiedText],
  )

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      {isRouteLoading ? (
        <div className='flex min-h-[50vh] items-center justify-center'>
          <Spinner show text='Loading schema' />
        </div>
      ) : (
        <>
          {/* Control Panel */}
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
                <Button onClick={addRootNode} variant='outline' className='transition-all duration-200 ease-in-out hover:shadow-md'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Root Node
                </Button>
                <Button
                  onClick={handleGenerateJSON}
                  variant='default'
                  disabled={isGenerating}
                  className={cn('transition-all hover:shadow-md', isGenerating && 'opacity-70')}
                >
                  {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Braces className='mr-2 h-4 w-4' />}
                  Generate JSON
                </Button>
              </div>
            </div>
          </div>

          {/* SchemaTabs Component */}
          <SchemaTabs tabs={tabs} defaultTab='schemaBuilder' />

          {/* Generated Data */}
          <div className='mt-6 border rounded-lg p-4 shadow-sm bg-card'>
            {isGenerating ? (
              <div className='flex items-center justify-center gap-2 p-20'>
                <Spinner show text='Generating JSON...' />
              </div>
            ) : generatedData ? (
              <div>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-semibold text-card-foreground'>Generated Result</h3>
                  <div className='flex gap-2'>
                    {/* Copy Button */}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={async () => {
                        await copy(JSON.stringify(generatedData, null, 2))
                        // Optionally, set a timeout to reset copiedText after a delay
                      }}
                      className='flex items-center gap-2 relative w-24 justify-center'
                    >
                      <div className={cn('flex items-center gap-2', copiedText && 'text-emerald-500')}>
                        {copiedText ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                        <span className='text-sm'>{copiedText ? 'Copied!' : 'Copy'}</span>
                      </div>
                    </Button>

                    {/* Download Button */}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(generatedData, null, 2)], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'generated-schema.json'
                        link.click()
                        URL.revokeObjectURL(url)
                      }}
                      className='flex items-center gap-2'
                    >
                      <Download className='mr-1 h-4 w-4' />
                      <span className='text-sm'>Download</span>
                    </Button>
                  </div>
                </div>

                {/* Display Generated JSON */}
                <AnimatedJSON
                  data={generatedData}
                  animate='characters' // or "characters" or "simple"
                  className='rounded-md p-4 bg-input text-foreground overflow-auto'
                />
              </div>
            ) : (
              <p className='text-muted-foreground text-center p-20'>{`Build your schema and click the "Generate JSON" button to see the result.`}</p>
            )}
          </div>

          {/* Handle Generation Errors */}
          {generationError && (
            <div className='mt-4 p-4 bg-destructive rounded-lg border border-destructive-foreground shadow-sm text-destructive-foreground'>
              <h3 className='text-sm font-medium'>Error:</h3>
              <p>{generationError.message}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
