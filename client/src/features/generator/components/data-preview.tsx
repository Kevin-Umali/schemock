import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { OUTPUT_MIME_TYPES } from '@/constants/formats'
import type { OutputFormat } from '@/types/schema'
import { preparePreview } from '@/features/generator/utils/preview'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { downloadText } from '@/utils/download'
import { displayValue } from '@/utils/format-value'
import { ArrowLeft, Braces, Check, ChevronLeft, ChevronRight, Copy, Download, Search, Table2 } from 'lucide-react'
import type * as React from 'react'
import { useMemo, useState } from 'react'

interface DataPreviewProps {
  data: unknown
  format: OutputFormat
  isPending: boolean
  error: Error | null
  stale: boolean
  onEditSchema: () => void
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, format, isPending, error, stale, onEditSchema }) => {
  const [view, setView] = useState<'table' | 'code'>('table')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [copied, copy] = useCopyToClipboard()
  const { rows, columns, filtered, pages, currentPage, text } = useMemo(
    () => preparePreview(data, format, search, page),
    [data, format, search, page],
  )
  return (
    <section
      className='flex min-w-0 flex-col overflow-hidden bg-card xl:h-full xl:min-h-0'
      aria-label='Generated data'
      aria-busy={isPending}
    >
      <div className='flex min-h-16 shrink-0 items-center justify-between gap-3 border-b px-4 py-3 md:px-6'>
        <div className='flex items-center gap-2 [&_h2]:text-sm [&_h2]:font-semibold [&_svg]:text-muted-foreground'>
          <Table2 size={17} />
          <h2>Generated data</h2>
        </div>
        <div className='flex gap-1'>
          <Button variant='ghost' size='icon' className='xl:hidden' aria-label='Back to schema' onClick={onEditSchema}>
            <ArrowLeft />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            aria-label='Copy generated data'
            disabled={data === undefined || isPending}
            onClick={() => copy(text)}
          >
            {copied === text && text ? <Check /> : <Copy />}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            aria-label='Download generated data'
            disabled={data === undefined || isPending}
            onClick={() => downloadText(text, `schemock-data.${format}`, OUTPUT_MIME_TYPES[format])}
          >
            <Download />
          </Button>
        </div>
      </div>
      {error && (
        <Alert variant='destructive' className='m-3 w-auto shrink-0'>
          <AlertTitle>Generation failed</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {isPending ? (
        <div className='min-h-72 overflow-auto p-5 text-sm text-muted-foreground xl:min-h-0 xl:flex-1' role='status'>
          <span>Generating your data…</span>
          {[1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} className='mt-4 h-6' />
          ))}
        </div>
      ) : data === undefined ? (
        <Empty className='min-h-56 px-6 py-10 xl:min-h-0 xl:flex-1'>
          <EmptyHeader>
            <EmptyTitle>Ready when you are</EmptyTitle>
            <EmptyDescription>Generate a dataset to inspect, search, and export it here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className='flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5'>
            {format === 'json' ? (
              <ToggleGroup
                value={[view]}
                onValueChange={(values) => {
                  if (values[0]) setView(values[0] as 'table' | 'code')
                }}
                aria-label='Preview format'
              >
                <ToggleGroupItem value='table'>
                  <Table2 />
                  Table
                </ToggleGroupItem>
                <ToggleGroupItem value='code'>
                  <Braces />
                  JSON
                </ToggleGroupItem>
              </ToggleGroup>
            ) : (
              <Badge variant='secondary'>{format.toUpperCase()} output</Badge>
            )}
            <span className='text-xs tabular-nums text-muted-foreground'>
              {format === 'json' ? `${rows.length} ${rows.length === 1 ? 'record' : 'records'}` : 'Ready to export'}
            </span>
          </div>
          {stale && (
            <Alert className='mx-4 my-3 w-auto shrink-0 bg-muted py-2'>
              <AlertDescription>Schema or settings changed. Generate again to refresh this output.</AlertDescription>
            </Alert>
          )}
          {format === 'json' && view === 'table' ? (
            <>
              <div className='mx-4 my-3 shrink-0'>
                <InputGroup>
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-label='Search generated records'
                    placeholder='Search records…'
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      setPage(0)
                    }}
                  />
                </InputGroup>
              </div>
              <Table
                containerClassName={filtered.length ? 'xl:flex-1' : undefined}
                viewportClassName='max-h-[32rem] xl:max-h-none xl:overscroll-contain'
                className='text-xs [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_th]:bg-muted [&_td]:max-w-44 [&_td]:truncate [&_td]:px-3 [&_td]:py-3 [&_th]:px-3'
              >
                <TableCaption className='sr-only'>Generated mock data</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope='col'>#</TableHead>
                    {columns.map((column) => (
                      <TableHead scope='col' key={column}>
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.slice(currentPage * 10, currentPage * 10 + 10).map((row, index) => (
                    <TableRow key={currentPage * 10 + index}>
                      <TableCell className='tabular-nums text-muted-foreground'>
                        {currentPage * 10 + index + 1}
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell key={column} title={displayValue(row[column])}>
                          {displayValue(row[column])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!filtered.length && (
                <Empty className='xl:min-h-0 xl:flex-1'>
                  <EmptyHeader>
                    <EmptyTitle>No matching records</EmptyTitle>
                    <EmptyDescription>Try another search.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
              <div className='flex shrink-0 items-center justify-between border-t px-3 py-2 text-xs tabular-nums text-muted-foreground [&>div]:flex [&>div]:items-center [&>div]:gap-2'>
                <span>
                  {filtered.length} matching {filtered.length === 1 ? 'record' : 'records'}
                </span>
                <div>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Previous preview page'
                    disabled={currentPage === 0}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <span>
                    {currentPage + 1} / {pages}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Next preview page'
                    disabled={currentPage + 1 >= pages}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <pre className='m-0 max-h-[36rem] overflow-auto p-4 font-mono text-xs leading-7 xl:min-h-0 xl:flex-1 xl:max-h-none'>
              <code>{text}</code>
            </pre>
          )}
        </>
      )}
      <div className='mt-auto flex shrink-0 justify-between gap-2 border-t bg-muted px-4 py-2 text-[11px] text-muted-foreground'>
        <span>
          {data === undefined ? 'Waiting for a run' : `${new TextEncoder().encode(text).length.toLocaleString()} bytes`}
        </span>
        <span>{format.toUpperCase()}</span>
      </div>
    </section>
  )
}
