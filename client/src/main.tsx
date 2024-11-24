import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, ErrorComponent, RouterProvider } from '@tanstack/react-router'
import TranstackProvider from '@/context/tanstackContext'

import '@/index.css'

import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import Spinner from '@/components/custom/spinner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className='p-2 text-2xl'>
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: { queryClient, fakerMethods: [], locales: [] },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <TranstackProvider queryClient={queryClient}>
        <RouterProvider router={router} />
      </TranstackProvider>
    </StrictMode>,
  )
}
