import type { Schema } from '@/types/schema'

export interface MockConfiguration {
  schema: Schema
  count: number
  locale: string
  page: number
  limit: number
  sort: string
}
