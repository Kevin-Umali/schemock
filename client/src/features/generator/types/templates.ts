import type { Schema } from '@/types/schema'
export interface SchemaTemplate {
  id: string
  name: string
  description: string
  schema: Schema
}
