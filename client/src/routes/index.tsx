import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TreeNode } from '@/types/tree'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { INITIAL_SCHEMA } from '@/constants'
import { convertToSchema } from '@/lib/schema'
import TreeView from '@/components/custom/tree-view'
import { Button } from '@/components/ui/button'
import { Check, Copy, Loader2, Share2 } from 'lucide-react'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import LZString from 'lz-string'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import Spinner from '@/components/custom/spinner'

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
      <Loader2 className='w-10 h-10 animate-spin' />
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
  const [localNodes, setLocalNodes] = useState<TreeNode[]>(() => {
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
    (newNodes: TreeNode[] | ((prev: TreeNode[]) => TreeNode[])) => {
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

  const handleCopy = async () => {
    const schemaString = JSON.stringify(generatedSchema, null, 2)
    await copy(schemaString)
  }

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
        name: 'newRoot',
        type: 'object',
        isRoot: false,
        children: [],
      },
    ])
  }

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      {isRouteLoading ? (
        <div className='flex items-center justify-center'>
          <Spinner show={isRouteLoading} />
        </div>
      ) : (
        <>
          <div className='border border-gray-300 rounded-lg p-4 mb-6 bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-md'>
            <div className='flex flex-wrap items-center gap-4'>
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

              <div className='ml-auto flex items-center gap-2'>
                <Button onClick={handleShare} variant='outline' className='transition-all duration-200 ease-in-out hover:shadow-md'>
                  <Share2 className='w-4 h-4 mr-2' />
                  {isDirty ? 'Save & Share Schema' : 'Share Schema'}
                </Button>
                <Button onClick={addRootNode} variant='outline' className='transition-all duration-200 ease-in-out hover:shadow-md'>
                  Add Root Node
                </Button>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='border border-gray-300 rounded-lg p-4 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Schema Builder</h2>
              <div className='transition-all duration-300 ease-in-out'>
                <TreeView nodes={localNodes} onChange={setNodes} allowAdd allowDelete defaultExpanded />
              </div>
            </div>

            <div className='border border-gray-300 rounded-lg p-4 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold text-gray-900'>Generated Schema</h2>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleCopy}
                  className='flex items-center gap-2 relative w-24 justify-center transition-all duration-200 ease-in-out hover:shadow-md'
                >
                  <div
                    className={cn(
                      'flex items-center gap-2 absolute transition-all duration-300 ease-in-out transform',
                      copiedText ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                    )}
                  >
                    <Check className='w-4 h-4 text-emerald-500' />
                    <span className='text-emerald-500 text-sm'>Copied!</span>
                  </div>
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
          </div>
        </>
      )}
    </div>
  )
}
