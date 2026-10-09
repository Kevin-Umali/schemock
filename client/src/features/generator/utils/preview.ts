import { displayValue } from '@/utils/format-value'
import { dataRows } from '@/utils/schema'
import type { OutputFormat } from '@/types/schema'

export const preparePreview = (data: unknown, format: OutputFormat, search: string, page: number) => {
  const rows = format === 'json' && data !== undefined ? dataRows(data) : []
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const query = search.toLowerCase()
  const filtered = rows.filter((row) =>
    Object.values(row).some((value) => displayValue(value).toLowerCase().includes(query)),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / 10))
  const currentPage = Math.min(page, pages - 1)
  const text = data === undefined ? '' : format === 'json' ? JSON.stringify(data, null, 2) : String(data)
  return { rows, columns, filtered, pages, currentPage, text }
}
