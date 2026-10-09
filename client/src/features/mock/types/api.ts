import type { Schema } from '@/types/schema'
export interface MockRequest {
  schema: Schema
  count: number
  locale: string
}
export interface PaginatedData {
  data: Record<string, unknown>[]
  page: number
  limit: number
  total: number
}
