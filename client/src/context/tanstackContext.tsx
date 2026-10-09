import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'
import { useState } from 'react'
export const TanstackQueryProvider: React.FC<
  Readonly<{
    queryClient?: QueryClient
    children: React.ReactNode
  }>
> = ({ queryClient, children }) => {
  const [queryClientInstance] = useState(
    () =>
      queryClient ??
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )
  return <QueryClientProvider client={queryClientInstance}>{children}</QueryClientProvider>
}
export default TanstackQueryProvider
