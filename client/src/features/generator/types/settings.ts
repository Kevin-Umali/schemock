import type { Schema } from '@/types/schema'
export interface GeneratorSettings {
  schema: Schema
  count: number
  locale: string
  tableName: string
  multiRowInsert: boolean
  flatten: boolean
}
export interface SavedSchema extends GeneratorSettings {
  id: string
  name: string
  updatedAt: string
}
