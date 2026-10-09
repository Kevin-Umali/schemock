import type { FakerMethodCategory } from '@/types/faker'
import type { FieldSourceKind } from '@/types/field-editor'
import type { SchemaValue } from '@/types/schema'
import { getFieldOptions, getFixedPrimitive, parseFixedPrimitive } from '@/utils/fields'
import { isObject } from '@/utils/schema'

export const getGeneratorOptions = (value: SchemaValue, methods: FakerMethodCategory[]) =>
  getFieldOptions(value, methods, 0).filter((option) => !option.value.startsWith('$'))

export const createFieldValue = (kind: FieldSourceKind): SchemaValue => {
  if (kind === 'object') return {}
  if (kind === 'array') return { items: 'lorem.word', count: 3 }
  if (kind === 'fixed') return 'custom.literal("")'
  return 'lorem.word'
}

export const readFixedValue = (value: SchemaValue) => {
  const parsed = parseFixedPrimitive(getFixedPrimitive(value))
  const type = parsed.value === null ? 'null' : typeof parsed.value
  const text = type === 'string' ? String(parsed.value) : getFixedPrimitive(value)
  return { type, text }
}

export const encodeFixedValue = (type: string, text: string): { value?: string; error?: string } => {
  if (type === 'string') {
    const encoded = `custom.literal(${JSON.stringify(text)})`
    if (encoded.length > 10_000) return { error: 'Shorten this value to fit the 10,000-character limit.' }
    return { value: encoded }
  }
  if (type === 'null') return { value: 'custom.literal(null)' }
  if (type === 'boolean' && ['true', 'false'].includes(text)) return { value: `custom.literal(${text})` }
  if (type === 'number' && text.trim() && Number.isFinite(Number(text)))
    return { value: `custom.literal(${JSON.stringify(Number(text))})` }
  return { error: type === 'number' ? 'Enter a finite number.' : 'Choose true or false.' }
}

export const countSchemaFields = (schema: SchemaValue, rootRecord = false): number => {
  if (!isObject(schema)) return 0
  if (!rootRecord && 'items' in schema && 'count' in schema) return countSchemaFields(schema.items as SchemaValue)
  return Object.values(schema).reduce<number>((count, value) => count + 1 + countSchemaFields(value as SchemaValue), 0)
}
