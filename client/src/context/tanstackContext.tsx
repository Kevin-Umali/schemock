'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function TanstackQueryProvider({ queryClient, children }: Readonly<{ queryClient?: QueryClient; children: React.ReactNode }>) {
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
