import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { SCHEMA_LIMITS } from '@/constants/schema-editor'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import type * as React from 'react'
import {
  API_ENDPOINTS,
  GUIDE_NAVIGATION,
  GUIDE_STEPS,
  MOCK_CURL_EXAMPLE,
  MOCK_REQUEST_EXAMPLE,
  SCHEMA_EXAMPLE,
} from '../constants/guide'
import { apiEndpointUrl, apiReferenceUrl } from '../utils/links'

export const UsageDocs: React.FC = () => {
  const [copied, copy] = useCopyToClipboard()
  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10'>
      <header className='flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6'>
        <div className='max-w-3xl'>
          <h1 className='text-3xl font-semibold tracking-tight text-foreground sm:text-4xl'>User guide</h1>
          <p className='mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
            Create a schema, generate sample records, and use them in your prototype, tests, or API demos.
          </p>
        </div>
        <Button
          variant='outline'
          nativeButton={false}
          role='link'
          render={<a href={apiReferenceUrl} target='_blank' rel='noreferrer' />}
        >
          API reference <ArrowUpRight data-icon='inline-end' />
        </Button>
      </header>

      <div className='grid gap-8 pt-8 lg:grid-cols-[13rem_minmax(0,1fr)] xl:gap-10'>
        <nav
          aria-label='Guide contents'
          className='sticky top-0 z-20 h-fit min-w-0 bg-background py-2 lg:top-4 lg:py-0'
        >
          <p className='mb-2 hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:block'>
            On this page
          </p>
          <div className='flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible'>
            {GUIDE_NAVIGATION.map((item) => (
              <Button
                key={item.href}
                variant='ghost'
                size='sm'
                nativeButton={false}
                role='link'
                render={<a href={item.href} />}
                className='shrink-0 justify-start text-muted-foreground hover:text-foreground'
              >
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        <article id='guide-content' className='min-w-0 max-w-4xl space-y-12'>
          <section id='getting-started' className='scroll-mt-20 lg:scroll-mt-8'>
            <h2 className='text-lg font-semibold tracking-tight'>Getting started</h2>
            <p className='mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              Follow these steps to build a schema and produce your first set of sample data.
            </p>
            <ol className='mt-5 space-y-4'>
              {GUIDE_STEPS.map((step, index) => (
                <li key={step.title} className='grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3'>
                  <span className='grid size-7 place-items-center rounded-full border border-border text-xs font-medium tabular-nums text-muted-foreground'>
                    {index + 1}
                  </span>
                  <div>
                    <h3 className='text-sm font-medium'>{step.title}</h3>
                    <p className='mt-1 max-w-[68ch] text-sm leading-6 text-muted-foreground'>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className='mt-7 grid gap-6 border-t border-border pt-6 sm:grid-cols-2'>
              <div>
                <h3 className='text-sm font-medium'>Import and save schemas</h3>
                <div className='mt-2 space-y-2 text-sm leading-6 text-muted-foreground'>
                  <p>
                    <strong className='font-medium text-foreground'>Import JSON</strong> accepts a sample object or
                    array and suggests generators from field names and value types. Review the fields before generating.
                  </p>
                  <p>
                    <strong className='font-medium text-foreground'>Saved schemas</strong> stores named schemas and
                    settings in this browser. Drafts are saved locally as you edit.
                  </p>
                  <p>
                    <strong className='font-medium text-foreground'>Share</strong> copies a link with the current schema
                    and settings. Anyone with the link can open that configuration.
                  </p>
                </div>
              </div>
              <div>
                <h3 className='text-sm font-medium'>JSON editor shortcuts</h3>
                <div className='mt-2 space-y-2 text-sm leading-6 text-muted-foreground'>
                  <p>
                    <kbd className='rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground'>
                      Ctrl/Cmd + Space
                    </kbd>{' '}
                    opens generator suggestions at the current value.
                  </p>
                  <p>
                    <kbd className='rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground'>
                      Ctrl/Cmd + Shift + F
                    </kbd>{' '}
                    formats the JSON schema.
                  </p>
                  <p>
                    Switch to JSON schema to add generator arguments, edit deeply nested structures, or paste a complete
                    schema.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id='schema' className='scroll-mt-20 border-t border-border pt-9 lg:scroll-mt-8'>
            <h2 className='text-lg font-semibold tracking-tight'>Build a schema</h2>
            <p className='mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              Each property becomes a field in the generated records. Pick a Faker method from the searchable field menu
              or write it directly in JSON.
            </p>
            <p className='mt-3 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              Choose a field in the outline to edit it. Use its branch chevron to expand or collapse children, Collapse
              all to fold the outline, and Reveal selected to find the active field. Breadcrumbs return to parent
              fields. At paths deeper than three levels, the breadcrumbs show the immediate parent and current field;
              use the “N parents” control to expand ancestors or “Fewer parents” to fold them again. The Full field path
              disclosure in field settings shows the complete dot path. Object fields contain named children; Array
              fields repeat the schema under Each item. Suggestions apply only when selected.
            </p>
            <p className='mt-3 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              On desktop, the Layout group in JSON, CSV, SQL, and Text templates controls Editor and Preview. Mock API
              has Endpoints, Editor, and Tester controls. Each button shows or hides its pane; a selected button means
              the pane is visible, and at least one pane stays open. Drag a divider, or focus it and use the keyboard,
              to resize panes. Reset workspace layout restores the default widths and visible panes. Hiding a pane keeps
              editor drafts and tester state in the tab. Layout choices are not saved in browser storage.
            </p>
            <p className='mt-3 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              In the desktop generator, the schema outline fills the available height. Its header and footer stay in
              place while the outline and field settings scroll independently. Use Schema outline to hide it; Show
              schema outline brings it back. Embedded mock schemas keep their natural height. On phones and tablets,
              workspace sections stack, and Test request stays available as a tab. Use Toggle Sidebar to collapse the
              app navigation.
            </p>
            <div className='mt-4 space-y-3 text-sm leading-6 text-muted-foreground'>
              <p>
                Use a method such as{' '}
                <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground'>
                  person.fullName
                </code>
                . Plain strings such as{' '}
                <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground'>active</code> stay
                fixed. Use{' '}
                <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground'>
                  {'custom.literal("active")'}
                </code>{' '}
                when a fixed string could be read as a generator.
              </p>
              <p>
                In the field editor, choose Fixed, then Text, Number, Boolean, or Null. Text values do not need quotes.
                Undo restores a field after removal or a change of kind. Finish or discard invalid edits before changing
                fields.
              </p>
              <p>
                Inside a field, the names <code className='font-mono text-xs'>items</code> and{' '}
                <code className='font-mono text-xs'>count</code> together define an array. Array configurations cannot
                contain additional keys. Rename one of those fields if you need an ordinary nested object.
              </p>
              <p>
                Put a nested object under a property to group related fields. To create a repeated list, use an{' '}
                <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground'>items</code> value
                and a <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground'>count</code>.
                Arrays can contain nested objects and other arrays.
              </p>
            </div>
            <Alert className='mt-4'>
              <AlertDescription>
                Generated email addresses use the reserved <code>example.test</code> domain. Treat them as sample values
                rather than real recipients.
              </AlertDescription>
            </Alert>
            <div className='mt-5 overflow-hidden rounded-lg border border-border'>
              <div className='flex items-center justify-between gap-4 border-b border-border px-4 py-3'>
                <div>
                  <h3 className='text-sm font-medium'>Nested schema example</h3>
                  <p className='mt-1 text-xs text-muted-foreground'>Objects and arrays can be combined.</p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Copy example schema'
                  onClick={() => copy(SCHEMA_EXAMPLE)}
                >
                  {copied === SCHEMA_EXAMPLE ? <Check /> : <Copy />}
                </Button>
              </div>
              <pre className='overflow-x-auto bg-muted/40 p-4 font-mono text-xs leading-6 text-foreground'>
                <code>{SCHEMA_EXAMPLE}</code>
              </pre>
            </div>
          </section>

          <section id='formats' className='scroll-mt-20 border-t border-border pt-9 lg:scroll-mt-8'>
            <h2 className='text-lg font-semibold tracking-tight'>Generate and export</h2>
            <p className='mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              Preview output in the app, then search, copy, or download it.
            </p>
            <div className='mt-4 overflow-hidden rounded-lg border border-border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Output</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead className='hidden md:table-cell'>What it does</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {API_ENDPOINTS.filter((endpoint) => endpoint.path.startsWith('/generate/')).map((endpoint) => (
                    <TableRow key={endpoint.path}>
                      <TableCell className='font-medium'>{endpoint.format}</TableCell>
                      <TableCell>
                        <code className='font-mono text-xs'>
                          {endpoint.method} {apiEndpointUrl(endpoint.path)}
                        </code>
                      </TableCell>
                      <TableCell className='hidden text-muted-foreground md:table-cell'>
                        {endpoint.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className='mt-5 grid gap-6 border-t border-border pt-5 sm:grid-cols-3'>
              <div>
                <h3 className='text-sm font-medium'>JSON</h3>
                <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                  Returns one object for a single record and an array for multiple records. Use the preview to search
                  and change display format.
                </p>
              </div>
              <div>
                <h3 className='text-sm font-medium'>CSV</h3>
                <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                  Downloads a CSV file. Flatten nested objects to turn paths such as <code>address.city</code> into
                  columns.
                </p>
              </div>
              <div>
                <h3 className='text-sm font-medium'>SQL</h3>
                <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                  Downloads INSERT statements. Choose a table name, combine rows into one statement, or flatten nested
                  fields.
                </p>
              </div>
            </div>
          </section>

          <section id='templates' className='scroll-mt-20 border-t border-border pt-9 lg:scroll-mt-8'>
            <h2 className='text-lg font-semibold tracking-tight'>Write text templates</h2>
            <p className='mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              Insert a Faker method inside double braces to fill a phrase, email, description, or other text.
            </p>
            <div className='mt-4 overflow-hidden rounded-lg border border-border'>
              <pre className='overflow-x-auto bg-muted/40 p-4 font-mono text-xs leading-6 text-foreground'>
                <code>{'Hello {{person.fullName}}, your order {{string.uuid}} is ready.'}</code>
              </pre>
              <p className='border-t border-border px-4 py-3 text-sm text-muted-foreground'>
                Hello Jordan Lee, your order 4a1… is ready.
              </p>
            </div>
            <p className='mt-4 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              Use generator search to insert a method at the text cursor. Choose the number of variations and locale.
              Turn on readable object formatting for paragraph-style output. Copy or download the generated text, or
              share the template settings in a link.
            </p>
          </section>

          <section id='mock-api' className='scroll-mt-20 border-t border-border pt-9 lg:scroll-mt-8'>
            <h2 className='text-lg font-semibold tracking-tight'>Use the mock API</h2>
            <p className='mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              To return a response you define, add a custom endpoint and configure its method, path, status, headers,
              delay up to 5 seconds, and body. To simulate records and writes, add a CRUD resource. Configure the
              endpoint, then open Test request to try it. Copy API URL and append the endpoint path to call it from your
              app. Share configuration copies an editor link for reopening the setup. Public URLs carry their
              configuration; no API key or saved project is needed.
            </p>
            <p className='mt-3 text-sm leading-6 text-muted-foreground'>
              Add ordered scenarios to match query parameters, request headers, or JSON body fields. All conditions must
              match; the first matching scenario wins. Otherwise the default response runs. HEAD mirrors GET without a
              body, and OPTIONS handles preflight.
            </p>
            <p className='mt-4 text-sm leading-6 text-muted-foreground'>
              CRUD resources return repeatable records with numeric IDs. GET accepts page, limit, and sort query
              parameters, such as ?page=2&limit=10&sort=name:asc. POST returns 201, PUT and PATCH return 200, and DELETE
              returns 204. Writes simulate responses and do not change later reads. Definitions and records are not
              saved; tester history stays in tab memory. Copy a new link after editing or regenerating data. Links have
              no expiry while their definition version is supported, though generator upgrades may change values. Use up
              to 20 endpoints/resources, 10 scenarios per endpoint, and a 6 KiB encoded definition.
            </p>
            <details className='mt-4 rounded-md border border-border px-4 py-3 text-sm'>
              <summary className='cursor-pointer font-medium'>Legacy pagination request example</summary>
              <div className='mt-3 overflow-hidden rounded-md border border-border'>
                <div className='flex items-center justify-between gap-4 border-b border-border px-4 py-3'>
                  <div>
                    <h3 className='text-sm font-medium'>cURL request</h3>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      The current builder also provides curl and fetch examples.
                    </p>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Copy legacy mock API request'
                    onClick={() => copy(MOCK_CURL_EXAMPLE)}
                  >
                    {copied === MOCK_CURL_EXAMPLE ? <Check /> : <Copy />}
                  </Button>
                </div>
                <pre className='overflow-x-auto bg-muted/40 p-4 font-mono text-xs leading-6 text-foreground'>
                  <code>{MOCK_CURL_EXAMPLE}</code>
                </pre>
              </div>
              <h3 className='mt-3 text-sm font-medium'>Request body</h3>
              <pre className='mt-2 overflow-x-auto rounded-md bg-muted/40 p-4 font-mono text-xs leading-6 text-foreground'>
                <code>{MOCK_REQUEST_EXAMPLE}</code>
              </pre>
            </details>
          </section>

          <section id='limits' className='scroll-mt-20 border-t border-border pt-9 lg:scroll-mt-8'>
            <h2 className='text-lg font-semibold tracking-tight'>Limits and troubleshooting</h2>
            <p className='mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground'>
              These limits help keep requests responsive.
            </p>
            <ul className='mt-4 space-y-2 text-sm leading-6 text-muted-foreground'>
              <li>
                <strong className='font-medium text-foreground'>Records:</strong> 1–100 per generation.
              </li>
              <li>
                <strong className='font-medium text-foreground'>Arrays:</strong> 1–100 items in each list.
              </li>
              <li>
                <strong className='font-medium text-foreground'>Schemas:</strong> up to {SCHEMA_LIMITS.fields} fields
                per object and {SCHEMA_LIMITS.depth} levels of nesting. Each field and array item adds one level.
              </li>
              <li>
                <strong className='font-medium text-foreground'>Template:</strong> up to 10,000 characters.
              </li>
              <li>
                <strong className='font-medium text-foreground'>Request body:</strong> up to 64 KB. Very large generated
                responses are rejected.
              </li>
            </ul>
            <div className='mt-6 space-y-4 border-t border-border pt-5 text-sm leading-6 text-muted-foreground'>
              <p>
                <strong className='font-medium text-foreground'>Unknown generator:</strong> open the Faker reference and
                use a listed method name. Generator arguments must be JSON values.
              </p>
              <p>
                <strong className='font-medium text-foreground'>Request too large:</strong> reduce record count, nested
                array sizes, or generated field lengths.
              </p>
              <p>
                <strong className='font-medium text-foreground'>429 rate limit:</strong> wait for the interval shown in
                the response’s <code>Retry-After</code> header, then try again.
              </p>
              <p>
                <strong className='font-medium text-foreground'>Invalid mock link:</strong> check that the full URL was
                copied. Reduce endpoints, scenarios, or response bodies if the definition exceeds 6 KiB encoded or 64
                KiB decompressed.
              </p>
              <p>
                <strong className='font-medium text-foreground'>Locale error:</strong> choose one of the locales in the
                selector.
              </p>
            </div>
            <div className='mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-sm text-muted-foreground'>
              <p>Need route details, request schemas, or response shapes?</p>
              <Button
                variant='outline'
                nativeButton={false}
                role='link'
                render={<a href={apiReferenceUrl} target='_blank' rel='noreferrer' />}
              >
                Open API reference <ArrowUpRight data-icon='inline-end' />
              </Button>
            </div>
          </section>
          <footer className='border-t border-border pt-5 text-xs text-muted-foreground'>
            <a href='#guide-content' className='hover:text-foreground'>
              Back to top
            </a>
          </footer>
        </article>
      </div>
    </div>
  )
}
