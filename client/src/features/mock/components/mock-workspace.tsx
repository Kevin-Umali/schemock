import { FieldEditor } from '@/components/schema/field-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SearchSelect } from '@/components/ui/search-select'
import { Field, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Empty, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { apiRequest } from '@/services/api-client'
import { apiUrl } from '@/utils/api-url'
import {
  createMockShareUrl,
  getMockLocaleOptions,
  getMockPageSizeOptions,
  readMockConfiguration,
} from '../utils/config'
import { useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { ArrowDown, ArrowRight, ArrowUp, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import type * as React from 'react'
import { useRef, useState } from 'react'
import type { MockRequest, PaginatedData } from '../types/api'
export const MockWorkspace: React.FC = () => {
  const { locales, fakerMethods } = useRouteContext({ from: '__root__' })
  const [initial] = useState(() => readMockConfiguration(window.location.search))
  const [schema, setSchema] = useState(initial.schema)
  const [fieldsValid, setFieldsValid] = useState(false)
  const [count, setCount] = useState(initial.count)
  const [locale, setLocale] = useState(initial.locale)
  const [page, setPage] = useState(initial.page)
  const [limit, setLimit] = useState(initial.limit)
  const [sort, setSort] = useState(initial.sort)
  const [request, setRequest] = useState<MockRequest | null>(null)
  const [copied, copy] = useCopyToClipboard()
  const [notice, setNotice] = useState('')
  const schemaEditorRef = useRef<HTMLDivElement | null>(null)
  const response = useQuery({
    queryKey: ['mock-page', request, page, limit, sort],
    enabled: Boolean(request),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryFn: () => {
      const query = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (sort) query.set('sort', sort)
      return apiRequest<PaginatedData>(`/mock/pagination?${query}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
    },
  })
  const data = response.data
  const pages = Math.max(1, Math.ceil((data?.total ?? count) / limit))
  const columns = [...new Set(data?.data.flatMap((row) => Object.keys(row)) ?? [])]
  const responseText = data ? JSON.stringify(data, null, 2) : ''
  const validCount = Number.isInteger(count) && count >= 1 && count <= 100
  const validLocale = locales.includes(locale)
  const valid = fieldsValid && validCount && validLocale
  const validationMessage = !fieldsValid
    ? 'Review the schema fields and fix any errors before generating.'
    : !validCount
      ? 'Use a whole number from 1 to 100 records.'
      : !validLocale
        ? 'Choose a supported locale.'
        : ''
  const share = async () => {
    setNotice(
      (await copy(createMockShareUrl(window.location.href, { schema, count, locale, page, limit, sort })))
        ? 'Mock configuration link copied.'
        : 'Could not copy the link. Check clipboard permissions.',
    )
  }
  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10'>
      <div className='flex items-start justify-between gap-6'>
        <div>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>Try a paginated response.</h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-muted-foreground'>
            Explore pages and sorting with a schema you control. Each request generates fresh data.
          </p>
        </div>
      </div>
      {notice && (
        <p role='status' className='my-3 text-sm text-muted-foreground'>
          {notice}
        </p>
      )}
      <section className='mt-8 min-w-0 overflow-hidden rounded-xl border border-border bg-card'>
        <div className='px-4 py-6 sm:px-6'>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold tracking-tight'>Response fields</h2>
            <p className='mt-1 text-sm text-muted-foreground'>Shape each record returned by the endpoint.</p>
          </div>
          <div ref={schemaEditorRef} tabIndex={-1} aria-label='Schema fields' className='min-w-0'>
            <FieldEditor
              schema={schema}
              onChange={setSchema}
              methods={fakerMethods}
              onValidityChange={setFieldsValid}
            />
          </div>
        </div>
        <div className='border-t border-border bg-muted/40 px-4 py-5 sm:px-6'>
          <div className='mb-4'>
            <h2 className='text-sm font-semibold'>Response settings</h2>
            <p className='mt-1 text-xs text-muted-foreground'>Choose the total record count and data locale.</p>
          </div>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.5fr]'>
            <Field name='mock-count' className='gap-1.5 text-sm'>
              <FieldLabel htmlFor='mock-count'>Total records</FieldLabel>
              <Input
                id='mock-count'
                type='number'
                min={1}
                max={100}
                value={count || ''}
                aria-invalid={!validCount}
                aria-describedby={!validCount ? 'mock-count-error' : undefined}
                onChange={(event) => setCount(Number(event.target.value))}
              />
              {!validCount && (
                <p id='mock-count-error' className='text-sm text-destructive'>
                  Use 1 to 100.
                </p>
              )}
            </Field>
            <Field name='mock-locale' className='gap-1.5 text-sm'>
              <FieldLabel htmlFor='mock-locale'>Locale</FieldLabel>
              <SearchSelect
                id='mock-locale'
                value={locale}
                options={getMockLocaleOptions(locales)}
                onChange={setLocale}
                label='Locale'
              />
            </Field>
          </div>
          {!valid && (
            <Alert variant='destructive'>
              <AlertDescription>{validationMessage}</AlertDescription>
            </Alert>
          )}
          <div className='mt-4 flex gap-2'>
            <Button
              className='min-h-11 flex-1 justify-center'
              disabled={response.isFetching}
              onClick={() => {
                if (!valid) {
                  if (!validCount) document.getElementById('mock-count')?.focus()
                  else if (!validLocale) document.getElementById('mock-locale')?.focus()
                  else schemaEditorRef.current?.focus()
                  return
                }
                setNotice('')
                setPage(1)
                setRequest({ schema, count, locale })
                if (request && JSON.stringify(request) === JSON.stringify({ schema, count, locale }) && page === 1)
                  void response.refetch()
              }}
            >
              Generate response
              <ArrowRight size={16} />
            </Button>
            <Button variant='outline' size='icon' aria-label='Share mock configuration' onClick={share}>
              <Share2 size={16} />
            </Button>
          </div>
        </div>
        <section className='min-w-0 border-t border-border'>
          <div className='flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6'>
            <div>
              <h2 className='text-lg font-semibold tracking-tight'>API response</h2>
              <p className='mt-1 text-sm text-muted-foreground'>Paginated records from the current schema.</p>
            </div>
            <Field
              name='mock-page-size'
              className='w-auto max-w-52 grid-cols-[auto_minmax(4rem,1fr)] items-center gap-2 text-xs sm:grid'
            >
              <FieldLabel>Page size</FieldLabel>
              <SearchSelect
                label='Page size'
                value={String(limit)}
                options={getMockPageSizeOptions()}
                onChange={(value) => {
                  setLimit(Number(value))
                  setPage(1)
                }}
              />
            </Field>
          </div>
          {response.error && (
            <Alert variant='destructive' className='m-3 w-auto'>
              <AlertDescription>{response.error.message}</AlertDescription>
            </Alert>
          )}
          {response.isFetching && (
            <div role='status' aria-label='Generating response' className='space-y-3 p-6'>
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </div>
          )}
          {data ? (
            <>
              <Table className='max-h-[32rem] overflow-auto text-left text-xs tabular-nums'>
                <TableCaption className='sr-only'>Paginated mock records</TableCaption>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column} scope='col'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-auto min-h-8 whitespace-nowrap px-2'
                          onClick={() => {
                            setSort(`${column}:${sort === `${column}:asc` ? 'desc' : 'asc'}`)
                            setPage(1)
                          }}
                        >
                          {column}
                          {sort === `${column}:asc` ? (
                            <ArrowUp data-icon='inline-end' />
                          ) : sort === `${column}:desc` ? (
                            <ArrowDown data-icon='inline-end' />
                          ) : null}
                        </Button>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell
                          key={column}
                          title={
                            typeof row[column] === 'object'
                              ? JSON.stringify(row[column])
                              : String(row[column] ?? 'null')
                          }
                          className='max-w-80 truncate whitespace-nowrap'
                        >
                          {typeof row[column] === 'object'
                            ? JSON.stringify(row[column])
                            : String(row[column] ?? 'null')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className='flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground'>
                <span>
                  {data.data.length} of {data.total} records
                </span>
                <div>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Previous page'
                    disabled={page === 1 || response.isFetching}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span>
                    {page} / {pages}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Next page'
                    disabled={page >= pages || response.isFetching}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              <details className='p-5 text-xs'>
                <summary>Inspect JSON response</summary>
                <pre className='mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-4 font-mono text-xs leading-6'>
                  {responseText}
                </pre>
                <Button variant='outline' size='sm' className='mt-3' onClick={() => copy(responseText)}>
                  {copied === responseText ? 'Copied' : 'Copy response'}
                </Button>
              </details>
            </>
          ) : (
            !response.isFetching && (
              <Empty className='min-h-72 px-6 py-8'>
                <EmptyTitle>Generate to preview a response</EmptyTitle>
                <EmptyDescription>
                  Define the fields, then generate a response.
                  <br />
                  Use the column headers to try sorting.
                </EmptyDescription>
              </Empty>
            )
          )}
        </section>
      </section>
      <details className='mt-6 text-sm'>
        <summary>Call this endpoint from your app</summary>
        <Textarea
          readOnly
          aria-label='Mock API request example'
          className='mt-3 font-mono text-xs min-h-40'
          value={`POST ${apiUrl(`/mock/pagination?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}`)}\nContent-Type: application/json\n\n${JSON.stringify({ schema, count, locale }, null, 2)}`}
        />
      </details>
    </div>
  )
}
