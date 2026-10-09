import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/layout/app-shell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getFakerFunctionsQueryOptions, getHelperEnumsQueryOptions } from '@/services/metadata'
import type { RootRouteContext } from '@/types/router'
import { createRootRouteWithContext, Link } from '@tanstack/react-router'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import type * as React from 'react'

const RootRouteContent: React.FC = () => (
  <NuqsAdapter>
    <TooltipProvider>
      <AppShell />
    </TooltipProvider>
  </NuqsAdapter>
)

export const Route = createRootRouteWithContext<RootRouteContext>()({
  beforeLoad: async ({ context }) => {
    const [fakerMethods, locales] = await Promise.all([
      context.queryClient.ensureQueryData(getFakerFunctionsQueryOptions()),
      context.queryClient.ensureQueryData(getHelperEnumsQueryOptions({ name: 'locale' })),
    ])
    return { fakerMethods, locales }
  },
  component: RootRouteContent,
  errorComponent: ({ error, reset }) => (
    <div
      className='mx-auto max-w-xl space-y-4 px-6 py-12 [&_h1]:text-2xl [&_h1]:font-semibold [&_p]:text-sm'
      role='alert'
    >
      <h1>Couldn’t load the workspace</h1>
      <p>{error instanceof Error ? error.message : 'The server could not be reached. Start the API and try again.'}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className='mx-auto max-w-xl space-y-4 px-6 py-12 [&_h1]:text-2xl [&_h1]:font-semibold [&_p]:text-sm'>
      <h1>This page doesn’t exist</h1>
      <Button nativeButton={false} role='link' render={<Link to='/' />}>
        Back to the workspace
      </Button>
    </div>
  ),
})
