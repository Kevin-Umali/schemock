import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { Textarea } from '@/components/ui/textarea'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { Copy, LoaderCircle, Send, Trash2 } from 'lucide-react'
import type * as React from 'react'
import { useRef, useState } from 'react'
import { MOCK_METHODS } from '../constants/definition'
import type { MockEntry } from '../types/definition'
import type { MockTestResult } from '../types/api'
import { requestMock } from '../services/request'
import { requestExamples } from '../utils/builder'
import { MockHeadersEditor } from './mock-headers-editor'

interface MockRequestTesterProps {
  baseUrl: string
  ready: boolean
  entry: MockEntry
  onNotice: (message: string) => void
}

export const MockRequestTester: React.FC<MockRequestTesterProps> = ({ baseUrl, ready, entry, onNotice }) => {
  const [method, setMethod] = useState<string>(entry.kind === 'endpoint' ? entry.method : 'GET')
  const [path, setPath] = useState(() => {
    const route = entry.path.replace(/:[A-Za-z][A-Za-z0-9_]*/g, '1')
    if (entry.kind !== 'endpoint' || entry.response.kind !== 'generated' || !entry.response.pagination) return route
    const { page, limit, sort } = entry.response.pagination
    return `${route}?${new URLSearchParams({ page: String(page), limit: String(limit), ...(sort ? { sort } : {}) })}`
  })
  const [body, setBody] = useState('{}')
  const [headers, setHeaders] = useState<Record<string, string>>({})
  const [headersError, setHeadersError] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<MockTestResult[]>([])
  const sequence = useRef(0)
  const [copied, copy] = useCopyToClipboard()
  const validPath = path.startsWith('/') && !path.startsWith('//') && !path.includes('#')
  const url = baseUrl && validPath ? `${baseUrl}${path}` : ''
  const examples = requestExamples(url, method, body, headers)
  const result = history[0]
  const send = async () => {
    const requestSequence = ++sequence.current
    setRunning(true)
    setError('')
    try {
      const result = await requestMock({ url, method, path, body, headers })
      if (requestSequence !== sequence.current) return
      setHistory((current) => [result, ...current].slice(0, 20))
    } catch (failure) {
      if (requestSequence === sequence.current)
        setError(failure instanceof Error ? failure.message : 'The request could not be sent.')
    } finally {
      if (requestSequence === sequence.current) setRunning(false)
    }
  }
  const copyExample = async (value: string, label: string) =>
    onNotice((await copy(value)) ? `${label} copied.` : 'Could not copy. Check clipboard permissions.')
  return (
    <section className='@container/tester min-w-0'>
      <p className='mb-5 text-sm text-muted-foreground'>
        Requests call your public URL. Writes return simulated responses.
      </p>
      <div className='grid items-start gap-6 @min-[48rem]/tester:grid-cols-[minmax(18rem,.8fr)_minmax(0,1.2fr)]'>
        <div className='min-w-0 space-y-4'>
          <h3 className='text-sm font-semibold'>Request</h3>
          <div className='grid gap-3 sm:grid-cols-[8rem_1fr]'>
            <Field className='gap-2'>
              <FieldLabel>Method</FieldLabel>
              <SearchSelect
                label='Request method'
                value={method}
                options={[...MOCK_METHODS, 'HEAD', 'OPTIONS'].map((value) => ({ value, label: value }))}
                onChange={setMethod}
              />
            </Field>
            <Field className='gap-2'>
              <FieldLabel htmlFor='mock-request-path'>Path and query</FieldLabel>
              <Input
                id='mock-request-path'
                className='font-mono text-xs'
                value={path}
                aria-invalid={!validPath}
                onChange={(event) => setPath(event.target.value)}
              />
            </Field>
          </div>
          {!validPath && <p className='text-xs text-destructive'>Start with a single / and omit URL fragments.</p>}
          {!['GET', 'HEAD', 'OPTIONS'].includes(method) && (
            <Field className='gap-2'>
              <FieldLabel htmlFor='mock-request-body'>Request body</FieldLabel>
              <Textarea
                id='mock-request-body'
                rows={4}
                className='font-mono text-xs'
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </Field>
          )}
          <details>
            <summary className='cursor-pointer text-xs font-medium'>Request headers</summary>
            <div className='pt-3'>
              <MockHeadersEditor
                id='mock-request-headers'
                label='Request headers (JSON)'
                value={headers}
                onChange={setHeaders}
                onIssue={setHeadersError}
              />
            </div>
          </details>
          <Button
            className='w-full min-h-11'
            disabled={!ready || !validPath || Boolean(headersError) || running}
            onClick={() => void send()}
          >
            {running ? (
              <LoaderCircle data-icon='inline-start' className='animate-spin motion-reduce:animate-none' />
            ) : (
              <Send data-icon='inline-start' />
            )}
            {running ? 'Sending request…' : 'Send request'}
          </Button>
          {error && (
            <p role='alert' className='text-sm text-destructive'>
              {error}
            </p>
          )}
          <details className='border-t border-border pt-4'>
            <summary className='cursor-pointer text-xs font-medium'>Use this request in your app</summary>
            {(['curl', 'fetch'] as const).map((kind) => (
              <div key={kind} className='mt-4 min-w-0'>
                <div className='flex items-center justify-between text-xs'>
                  <span>{kind === 'curl' ? 'curl' : 'JavaScript fetch'}</span>
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={!ready || !validPath}
                    onClick={() => void copyExample(examples[kind], kind)}
                  >
                    <Copy data-icon='inline-start' />
                    Copy
                  </Button>
                </div>
                <pre className='mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted/50 p-3 font-mono text-xs leading-5'>
                  {url ? examples[kind] : 'Finish the endpoint configuration to create a URL.'}
                </pre>
              </div>
            ))}
          </details>
          {history.length > 0 && (
            <details className='border-t border-border pt-4'>
              <summary className='cursor-pointer text-xs font-medium'>Recent tester calls ({history.length})</summary>
              <p className='mt-2 text-xs text-muted-foreground'>
                Only calls from this tester are shown. History disappears when you reload or change endpoints.
              </p>
              <ol className='mt-2 space-y-2'>
                {history.map((item, index) => (
                  <li key={index} className='flex min-w-0 gap-2 text-xs'>
                    <span className='font-mono'>{item.status}</span>
                    <span className='min-w-0 flex-1 break-all font-mono'>
                      {item.method} {item.path}
                    </span>
                    <span>{item.duration} ms</span>
                  </li>
                ))}
              </ol>
              <Button variant='ghost' size='sm' className='mt-2' onClick={() => setHistory([])}>
                <Trash2 data-icon='inline-start' />
                Clear history
              </Button>
            </details>
          )}
        </div>
        <section aria-label='Mock response' className='min-w-0 space-y-4'>
          <h3 className='text-sm font-semibold'>Response</h3>
          <div aria-live='polite' className='min-w-0'>
            {result ? (
              <>
                <div className='flex items-center justify-between gap-2 text-xs'>
                  <span className='font-medium'>Status {result.status}</span>
                  <span className='text-muted-foreground'>{result.duration} ms</span>
                  <Button size='sm' variant='ghost' onClick={() => void copyExample(result.body, 'Response')}>
                    <Copy data-icon='inline-start' />
                    {copied === result.body ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre className='mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/50 p-4 font-mono text-xs leading-6'>
                  {result.body || '(empty response)'}
                </pre>
                <details className='mt-3'>
                  <summary className='cursor-pointer text-xs font-medium'>Response headers</summary>
                  <pre className='mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5'>
                    {Object.entries(result.headers)
                      .map(([name, value]) => `${name}: ${value}`)
                      .join('\n')}
                  </pre>
                </details>
              </>
            ) : (
              <div className='flex min-h-72 items-center justify-center rounded-md bg-muted/50 p-6 text-center text-sm text-muted-foreground'>
                Send a request to inspect the response.
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  )
}
