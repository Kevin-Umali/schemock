import { isObject, validateSchema } from '@/utils/schema'
import type { GeneratorSettings } from '../types/settings'
import type { OutputFormat } from '@/types/schema'
export const isValidTableName = (format: OutputFormat, tableName: string): boolean =>
  format !== 'sql' || /^\w{1,64}$/.test(tableName)
export const isSettings = (value: unknown): value is GeneratorSettings => {
  if (!isObject(value)) return false
  try {
    validateSchema(value.schema)
  } catch {
    return false
  }
  return (
    Number.isInteger(value.count) &&
    Number(value.count) >= 1 &&
    Number(value.count) <= 100 &&
    typeof value.locale === 'string' &&
    typeof value.tableName === 'string' &&
    typeof value.multiRowInsert === 'boolean' &&
    typeof value.flatten === 'boolean'
  )
}
