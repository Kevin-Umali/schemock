import { useCallback, useState, useEffect } from 'react'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Braces, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Share2 } from 'lucide-react'
import Spinner from '@/components/custom/spinner'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { api } from '@/api/api'
import { type MockBodyPagination } from '@server/schema/mock.schema'

// Define the search schema with explicit types
const mockSearchSchema = z.object({
  s: fallback(z.string(), '').optional().default(''),
  c: fallback(z.number().min(1).max(100), 20).optional().default(20),
  l: fallback(z.string(), 'en').optional().default('en'),
  p: fallback(z.number().min(1), 1).optional().default(1),
  lim: fallback(z.number().min(1).max(20), 10).optional().default(10),
  sort: fallback(z.string(), '').optional().default(''),
})

// Define the type for the search params
type MockSearchParams = z.infer<typeof mockSearchSchema>

export const Route = createFileRoute('/mock')({
  validateSearch: zodValidator(mockSearchSchema),
  component: Mock,
  pendingComponent: () => (
    <div className='flex items-center justify-center'>
      <Spinner show text='Loading...' />
    </div>
  ),
  pendingMinMs: 3000,
  pendingMs: 10,
})

interface PaginatedData {
  data: Record<string, any>[]
  page: number
  limit: number
  total: number
}

function Mock() {
  const { s: compressedSchema, c: count, l: locale, p: page, lim: limit, sort } = Route.useSearch() as MockSearchParams
  const isRouteLoading = useRouterState().isLoading
  const { locales } = Route.useRouteContext()

  const navigate = useNavigate({ from: Route.fullPath })
  const [, copy] = useCopyToClipboard()
  const [schemaInput, setSchemaInput] = useState<string>(() => {
    try {
      return compressedSchema
        ? compressedSchema
        : JSON.stringify(
            {
              name: 'person.firstName',
              email: 'internet.email',
              age: 'datatype.number',
              isActive: 'datatype.boolean',
            },
            null,
            2,
          )
    } catch (error) {
      return JSON.stringify(
        {
          name: 'person.firstName',
          email: 'internet.email',
          age: 'datatype.number',
          isActive: 'datatype.boolean',
        },
        null,
        2,
      )
    }
  })
  const [schemaError, setSchemaError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [paginatedData, setPaginatedData] = useState<PaginatedData | null>(null)
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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

  const setPage = useCallback(
    (value: number) => {
      navigate({
        search: (prev) => ({
          ...prev,
          p: value,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const setLimit = useCallback(
    (value: number) => {
      navigate({
        search: (prev) => ({
          ...prev,
          lim: value,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const setSort = useCallback(
    (field: string, order: 'asc' | 'desc') => {
      navigate({
        search: (prev) => ({
          ...prev,
          sort: field ? `${field}:${order}` : '',
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value)
      setCount(value > 0 && value <= 100 ? value : 20)
    },
    [setCount],
  )

  const handleLimitChange = useCallback(
    (value: string) => {
      setLimit(parseInt(value))
    },
    [setLimit],
  )

  const handleSchemaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchemaInput(e.target.value)
    setSchemaError(null)
  }, [])

  const handleGenerateMock = useCallback(async () => {
    try {
      setIsGenerating(true)
      const schema = JSON.parse(schemaInput)

      const sortParam = sortField ? `${sortField}:${sortOrder}` : ''

      const res = await api.mock.pagination.$post({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          sort: sortParam,
        },
        json: {
          schema,
          count,
          locale,
        } as MockBodyPagination,
      })

      if (!res.ok) {
        throw new Error('Failed to generate mock data')
      }

      const data = await res.json()
      setPaginatedData(data)

      // Update URL with sort parameters
      if (sortParam) {
        setSort(sortField, sortOrder)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setSchemaError('Invalid JSON schema')
      } else {
        setSchemaError((error as Error).message || 'An error occurred')
      }
    } finally {
      setIsGenerating(false)
    }
  }, [schemaInput, page, limit, count, locale, sortField, sortOrder, setSort])

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

  const handleSortChange = useCallback(
    (field: string) => {
      if (sortField === field) {
        // Toggle sort order if same field
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        // New field, default to ascending
        setSortField(field)
        setSortOrder('asc')
      }
    },
    [sortField, sortOrder],
  )

  // Parse sort from URL
  useEffect(() => {
    if (sort) {
      const [field, order] = sort.split(':')
      setSortField(field)
      setSortOrder(order as 'asc' | 'desc')
    } else {
      setSortField('')
      setSortOrder('asc')
    }
  }, [sort])

  // Generate data when page, limit, or sort changes
  useEffect(() => {
    if (paginatedData) {
      handleGenerateMock()
    }
  }, [page, limit, handleGenerateMock, paginatedData])

  const totalPages = paginatedData ? Math.ceil(paginatedData.total / paginatedData.limit) : 0

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      {isRouteLoading ? (
        <div className='flex min-h-[50vh] items-center justify-center'>
          <Spinner show text='Loading mock data generator' />
        </div>
      ) : (
        <>
          {/* Control Panel */}
          <div className='border rounded-lg p-4 mb-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Mock API Generator</h2>
            <div className='flex flex-wrap items-center gap-4 mb-4'>
              {/* Count Input */}
              <div className='flex items-center gap-2'>
                <label htmlFor='count' className='text-sm font-medium text-gray-700'>
                  Total Records:
                </label>
                <Input
                  id='count'
                  type='number'
                  min={1}
                  max={100}
                  value={count ?? 20}
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

              {/* Action Buttons */}
              <div className='ml-auto flex items-center gap-2'>
                <Button onClick={handleShare} variant='outline' className='transition-all duration-200 ease-in-out hover:shadow-md'>
                  <Share2 className='w-4 h-4 mr-2' />
                  Share
                </Button>
                <Button
                  onClick={handleGenerateMock}
                  variant='default'
                  disabled={isGenerating}
                  className={cn('transition-all hover:shadow-md', isGenerating && 'opacity-70')}
                >
                  {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Braces className='mr-2 h-4 w-4' />}
                  Generate Mock API
                </Button>
              </div>
            </div>

            {/* Schema Input */}
            <div className='mt-4'>
              <label htmlFor='schema' className='block text-sm font-medium text-gray-700 mb-1'>
                Schema (JSON):
              </label>
              <Textarea
                id='schema'
                value={schemaInput}
                onChange={handleSchemaChange}
                className={cn('font-mono text-sm min-h-[150px]', schemaError && 'border-red-500')}
                placeholder='Enter your schema as JSON...'
              />
              {schemaError && <p className='mt-1 text-sm text-red-500'>{schemaError}</p>}
            </div>
          </div>

          {/* Generated Mock Data */}
          {paginatedData && (
            <div className='border rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold text-gray-900'>Mock API Response</h2>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-500'>
                    Page {paginatedData.page} of {totalPages}
                  </span>
                  <Select value={limit.toString()} onValueChange={handleLimitChange}>
                    <SelectTrigger className='w-20'>
                      <SelectValue placeholder='10' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='5'>5</SelectItem>
                        <SelectItem value='10'>10</SelectItem>
                        <SelectItem value='15'>15</SelectItem>
                        <SelectItem value='20'>20</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Table */}
              {paginatedData.data.length > 0 ? (
                <div className='rounded-md border overflow-hidden'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(paginatedData.data[0]).map((key) => (
                          <TableHead
                            key={key}
                            className={cn('cursor-pointer hover:bg-gray-50', sortField === key && 'bg-gray-50 font-semibold')}
                            onClick={() => handleSortChange(key)}
                          >
                            <div className='flex items-center gap-1'>
                              {key}
                              {sortField === key && <span className='text-xs'>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.data.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value, i) => (
                            <TableCell key={i}>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>No data available</div>
              )}

              {/* Pagination Controls */}
              <div className='flex justify-between items-center mt-4'>
                <div className='text-sm text-gray-500'>
                  Showing {paginatedData.data.length} of {paginatedData.total} results
                </div>
                <div className='flex items-center gap-1'>
                  <Button variant='outline' size='icon' onClick={() => setPage(1)} disabled={paginatedData.page === 1} className='h-8 w-8'>
                    <ChevronsLeft className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' size='icon' onClick={() => setPage(paginatedData.page - 1)} disabled={paginatedData.page === 1} className='h-8 w-8'>
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <span className='mx-2 text-sm'>
                    Page {paginatedData.page} of {totalPages}
                  </span>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setPage(paginatedData.page + 1)}
                    disabled={paginatedData.page === totalPages}
                    className='h-8 w-8'
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' size='icon' onClick={() => setPage(totalPages)} disabled={paginatedData.page === totalPages} className='h-8 w-8'>
                    <ChevronsRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
