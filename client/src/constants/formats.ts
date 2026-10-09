import type { OutputFormat } from '@/types/schema'
export const OUTPUT_MIME_TYPES: Record<OutputFormat, string> = {
  json: 'application/json',
  csv: 'text/csv',
  sql: 'text/sql',
}
