import type { Schema } from '@/types/schema'
export interface SchemaIssue {
  message: string
  value?: string
}
export interface SchemaCheck {
  schema?: Schema
  issues: SchemaIssue[]
}
