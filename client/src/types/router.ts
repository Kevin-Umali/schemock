import type { QueryClient } from '@tanstack/react-query'
import type { FakerMethodCategory } from '@/types/faker'
export interface RootRouteContext {
  queryClient: QueryClient
  fakerMethods: FakerMethodCategory[]
  locales: string[]
}
