import { WorkspaceLayoutControls } from '@/components/layout/workspace-layout-controls'
import { useWorkspaceLayout } from '@/hooks/use-workspace-layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { Skeleton } from '@/components/ui/skeleton'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WORKSPACE_DESKTOP_MEDIA_QUERY } from '@/constants/workspace'
import { useMediaQuery } from '@/hooks/use-media-query'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { useRouteContext } from '@tanstack/react-router'
import { Copy, Plus, RotateCcw, Share2, Trash2, X } from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'
import { MOCK_LIMITS } from '../constants/definition'
import { useMockBuilder } from '../hooks/use-mock-builder'
import { createMockEndpoint, createMockResource, nextMockPath } from '../utils/builder'
import { MockEndpointEditor } from './mock-endpoint-editor'
import { MockRequestTester } from './mock-request-tester'
import { MockScenariosEditor } from './mock-scenarios-editor'

export const MockWorkspace: React.FC = () => {
  const { locales, fakerMethods } = useRouteContext({ from: '__root__' })
  const builder = useMockBuilder()
  const { definition, entry, selected, updateEntry, reportIssue } = builder
  const isDesktop = useMediaQuery(WORKSPACE_DESKTOP_MEDIA_QUERY)
  const layout = useWorkspaceLayout({ endpoints: 18, editor: 52, tester: 30 })
  const [workspaceTab, setWorkspaceTab] = useState({ entry: selected, value: 'configuration' })
  const selectedTab = workspaceTab.entry === selected ? workspaceTab.value : 'configuration'
  const activeTab = isDesktop && selectedTab === 'test' ? 'configuration' : selectedTab
  const [copied, copy] = useCopyToClipboard()
  const copyLink = async (value: string, label: string) =>
    builder.setNotice(
      (await copy(value)) ? `${label} copied.` : 'Could not copy the link. Check clipboard permissions.',
    )
  return (
    <div className='flex h-full min-h-0 flex-col overflow-hidden'>
      <header className='shrink-0 border-b border-border bg-card px-4 py-3 sm:py-4 md:px-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-xl font-semibold tracking-tight'>Mock API</h1>
            <p className='mt-1 hidden text-xs text-muted-foreground sm:block'>
              Configure an endpoint, then try a request.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            {isDesktop && (
              <WorkspaceLayoutControls
                panels={[
                  {
                    label: 'Endpoints',
                    side: 'left',
                    hidden: Boolean(layout.hidden.endpoints),
                    onToggle: () => layout.toggle('endpoints'),
                  },
                  {
                    label: 'Editor',
                    side: 'left',
                    hidden: Boolean(layout.hidden.editor),
                    onToggle: () => layout.toggle('editor'),
                  },
                  ...(entry
                    ? [
                        {
                          label: 'Tester',
                          side: 'right' as const,
                          hidden: Boolean(layout.hidden.tester),
                          onToggle: () => layout.toggle('tester'),
                        },
                      ]
                    : []),
                ]}
                onReset={layout.reset}
              />
            )}
            <Button
              variant='outline'
              size='sm'
              aria-label='Regenerate data'
              className='min-h-11 min-w-11 sm:min-h-0 sm:min-w-0'
              disabled={!builder.ready}
              onClick={builder.regenerate}
            >
              <RotateCcw data-icon='inline-start' />
              <span className='hidden sm:inline'>Regenerate data</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              aria-label='Share configuration'
              className='min-h-11 min-w-11 sm:min-h-0 sm:min-w-0'
              disabled={!builder.ready}
              onClick={() => void copyLink(builder.shareUrl, 'Editor link')}
            >
              <Share2 data-icon='inline-start' />
              <span className='hidden sm:inline'>Share configuration</span>
            </Button>
          </div>
        </div>
        <div className='mt-3 flex min-w-0 gap-2 sm:mt-4'>
          <Input
            aria-label='API base URL'
            readOnly
            className='min-w-0 flex-1 font-mono text-xs'
            value={builder.ready ? builder.baseUrl : ''}
            placeholder='Your API URL appears when the configuration is valid.'
          />
          <Button
            variant='outline'
            aria-label={copied === builder.baseUrl ? 'Copied' : 'Copy API URL'}
            className='min-h-11 min-w-11 sm:min-h-0 sm:min-w-0'
            disabled={!builder.ready}
            onClick={() => void copyLink(builder.baseUrl, 'API base URL')}
          >
            <Copy data-icon='inline-start' />
            <span className='hidden sm:inline'>{copied === builder.baseUrl ? 'Copied' : 'Copy API URL'}</span>
          </Button>
        </div>
        <p className='mt-2 text-xs text-muted-foreground'>
          Public URLs. Configuration travels in the link; writes are simulated.
        </p>
        {builder.notice && (
          <div role='status' className='mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground'>
            <span>{builder.notice}</span>
            <Button variant='ghost' size='icon-sm' aria-label='Dismiss message' onClick={() => builder.setNotice('')}>
              <X size={14} />
            </Button>
          </div>
        )}
        {builder.error && (
          <Alert variant='destructive' className='mt-3 py-2'>
            <AlertDescription>{builder.error}</AlertDescription>
          </Alert>
        )}
      </header>
      {builder.loading ? (
        <div className='space-y-4 p-6' aria-label='Loading mock configuration'>
          <Skeleton className='h-10 w-1/3' />
          <Skeleton className='h-80 w-full' />
        </div>
      ) : (
        <Tabs
          key={selected}
          value={activeTab}
          onValueChange={(value) => setWorkspaceTab({ entry: selected, value: String(value) })}
          className='grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-[auto_auto_minmax(0,1fr)] gap-0 bg-card xl:block'
        >
          <ResizablePanelGroup
            groupRef={layout.groupRef}
            orientation='horizontal'
            disabled={!isDesktop}
            data-stacked={isDesktop ? undefined : 'tabs'}
          >
            <ResizablePanel
              {...layout.panelProps('endpoints')}
              minSize={isDesktop ? '10rem' : 0}
              collapsible={isDesktop}
              inert={isDesktop && layout.hidden.endpoints}
              className='min-h-0 overflow-hidden!'
            >
              <aside
                className='row-start-1 flex min-h-0 min-w-0 flex-col border-b border-border bg-muted/30 xl:h-full xl:border-b-0'
                aria-label='Mock endpoints'
              >
                <div className='hidden shrink-0 items-center justify-between px-4 py-4 text-xs xl:flex'>
                  <h2 className='font-semibold'>Endpoints</h2>
                  <span className='text-muted-foreground'>
                    {definition.entries.length}/{MOCK_LIMITS.entries}
                  </span>
                </div>
                <div className='hidden min-h-0 flex-1 overflow-y-auto px-2 pb-3 xl:block'>
                  {definition.entries.map((item, index) => (
                    <Button
                      variant='ghost'
                      key={index}
                      type='button'
                      aria-pressed={selected === index}
                      className={`mb-1 h-auto w-full min-w-0 flex-col items-start gap-1 whitespace-normal px-3 py-3 text-left ${selected === index ? 'bg-accent text-accent-foreground' : ''}`}
                      onClick={() => builder.selectEntry(index)}
                    >
                      <span className='block text-xs text-muted-foreground'>
                        {item.kind === 'resource' ? 'CRUD resource' : item.method}
                      </span>
                      <span className='mt-1 block break-all font-mono text-sm'>{item.path || '/'}</span>
                    </Button>
                  ))}
                </div>
                {entry && (
                  <div className='px-4 py-3 xl:hidden'>
                    <SearchSelect
                      label='Selected endpoint'
                      value={String(selected)}
                      options={definition.entries.map((item, index) => ({
                        value: String(index),
                        label: `${item.kind === 'resource' ? 'CRUD' : item.method} ${item.path}`,
                      }))}
                      onChange={(value) => builder.selectEntry(Number(value))}
                    />
                  </div>
                )}
                <div className='grid shrink-0 grid-cols-2 gap-2 px-4 pb-4 xl:grid-cols-1 xl:border-t xl:pt-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={definition.entries.length >= MOCK_LIMITS.entries}
                    onClick={() => builder.addEntry(createMockEndpoint(nextMockPath(definition.entries, 'endpoint')))}
                  >
                    <Plus data-icon='inline-start' />
                    Custom endpoint
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={definition.entries.length >= MOCK_LIMITS.entries}
                    onClick={() => builder.addEntry(createMockResource(nextMockPath(definition.entries, 'resource')))}
                  >
                    <Plus data-icon='inline-start' />
                    CRUD resource
                  </Button>
                </div>
              </aside>
            </ResizablePanel>
            <ResizableHandle
              withHandle
              aria-label='Resize endpoints and editor'
              disabled={!isDesktop}
              className={isDesktop ? '' : 'hidden'}
            />
            <ResizablePanel
              {...layout.panelProps('editor')}
              minSize={isDesktop ? '30%' : 0}
              collapsible={isDesktop}
              inert={isDesktop && layout.hidden.editor}
              className='grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden!'
            >
              {entry ? (
                <>
                  <div className='col-start-1 row-start-2 min-w-0 xl:row-start-1 border-b border-border px-4 pt-3 md:px-6'>
                    <div className='flex items-center justify-between gap-3'>
                      <h2 className='min-w-0 truncate font-mono text-sm font-medium' title={entry.path || '/'}>
                        {entry.path || '/'}
                      </h2>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label='Remove selected endpoint'
                        onClick={builder.removeEntry}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <TabsList
                      aria-label='Endpoint workspace'
                      className='h-12 w-full justify-start gap-3 rounded-none bg-transparent p-0 sm:gap-5'
                    >
                      {[
                        { value: 'configuration', label: 'Configuration' },
                        { value: 'scenarios', label: `Scenarios (${entry.scenarios.length})` },
                        { value: 'test', label: 'Test request' },
                      ]
                        .filter(({ value }) => !isDesktop || value !== 'test')
                        .map(({ value, label }) => (
                          <TabsTrigger
                            key={value}
                            value={value}
                            {...(value === 'test'
                              ? { id: 'mock-test-tab', 'aria-controls': 'mock-request-tester' }
                              : {})}
                            className='h-full flex-none rounded-none border-x-0 border-t-0 border-b-2 px-0 text-xs sm:text-sm data-[active]:border-foreground data-[active]:bg-transparent data-[active]:shadow-none'
                          >
                            {label}
                          </TabsTrigger>
                        ))}
                    </TabsList>
                  </div>
                  <TabsContent
                    value='configuration'
                    keepMounted
                    className='col-start-1 row-start-3 min-h-0 xl:row-start-2 overflow-y-auto overscroll-contain p-4 data-[hidden]:hidden md:p-6'
                  >
                    <MockEndpointEditor
                      entry={entry}
                      methods={fakerMethods}
                      locales={locales}
                      onChange={updateEntry}
                      onIssue={reportIssue}
                    />
                  </TabsContent>
                  <TabsContent
                    value='scenarios'
                    keepMounted
                    className='col-start-1 row-start-3 min-h-0 xl:row-start-2 overflow-y-auto overscroll-contain p-4 data-[hidden]:hidden md:p-6'
                  >
                    <MockScenariosEditor
                      scenarios={entry.scenarios}
                      resource={entry.kind === 'resource'}
                      methods={fakerMethods}
                      locales={locales}
                      onChange={(scenarios) => {
                        builder.clearScenarioIssues()
                        updateEntry({ ...entry, scenarios })
                      }}
                      onIssue={reportIssue}
                    />
                  </TabsContent>
                </>
              ) : (
                <div className='row-start-2 overflow-y-auto p-8 text-center text-sm text-muted-foreground xl:row-start-1'>
                  Add a custom endpoint or CRUD resource to create a mock URL.
                </div>
              )}
            </ResizablePanel>
            <ResizableHandle
              withHandle
              aria-label='Resize editor and request tester'
              disabled={!isDesktop}
              className={isDesktop && entry ? '' : 'hidden'}
            />
            <ResizablePanel
              {...layout.panelProps('tester')}
              minSize={isDesktop && entry ? '25%' : 0}
              maxSize={entry ? '100%' : 0}
              collapsible={isDesktop}
              inert={isDesktop && layout.hidden.tester}
              className='min-h-0 overflow-hidden!'
            >
              {entry && (
                <section
                  id='mock-request-tester'
                  role={isDesktop ? 'region' : 'tabpanel'}
                  aria-label={isDesktop ? 'Request tester' : undefined}
                  aria-labelledby={isDesktop ? undefined : 'mock-test-tab'}
                  tabIndex={0}
                  hidden={!isDesktop && activeTab !== 'test'}
                  className={`col-start-1 row-start-3 min-h-0 min-w-0 flex-col overflow-hidden outline-none xl:h-full ${isDesktop || activeTab === 'test' ? 'flex' : 'hidden'}`}
                >
                  <h2 className='hidden shrink-0 border-b border-border px-4 py-4 text-sm font-semibold xl:block md:px-6'>
                    Request tester
                  </h2>
                  <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6'>
                    <MockRequestTester
                      key={`tester-${selected}-${entry.path}-${entry.kind === 'endpoint' ? entry.method : 'resource'}`}
                      baseUrl={builder.baseUrl}
                      ready={builder.ready}
                      entry={entry}
                      onNotice={builder.setNotice}
                    />
                  </div>
                </section>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </Tabs>
      )}
    </div>
  )
}
