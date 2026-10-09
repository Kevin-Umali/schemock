import { NAMED_GENERATORS } from '@/constants/schema-inference'
import { SCHEMA_LIMITS, RESERVED_FIELD_NAMES } from '@/constants/schema-editor'
import type { TreeDataNode } from '@/types/legacy-schema'
import type { ArraySchema, Schema, SchemaValue } from '@/types/schema'
import { convertToSchema } from '@/utils/legacy-schema'
import LZString from 'lz-string'
import { normalizeFieldName } from '@/utils/field-name'
import { appendSchemaPath } from '@/utils/schema-path'
import { assertSchemaDepth } from '@/utils/schema-depth'
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
export const isArraySchema = (value: SchemaValue): value is ArraySchema => {
  return isObject(value) && 'items' in value && 'count' in value
}
const validateSchemaRecord = (value: Record<string, unknown>, depth: number, path: string): void => {
  assertSchemaDepth(depth, path)
  if (Object.keys(value).length > SCHEMA_LIMITS.fields) throw new Error('Use at most 100 fields per object.')
  for (const [key, field] of Object.entries(value)) {
    const fieldPath = appendSchemaPath(path, key)
    assertSchemaDepth(depth + 1, fieldPath)
    if (!key.trim()) throw new Error('Every field needs a name.')
    if (RESERVED_FIELD_NAMES.has(key)) throw new Error(`Choose a different field name for "${key}".`)
    if (typeof field === 'number' && !Number.isFinite(field)) throw new Error(`"${key}" must be a finite number.`)
    if (typeof field === 'string' && field.length > SCHEMA_LIMITS.valueCharacters)
      throw new Error(`"${key}" is too long. Use at most 10,000 characters.`)
    if (isObject(field)) validateSchemaValue(field, key, depth + 1, fieldPath)
    else if (field !== null && !['string', 'number', 'boolean'].includes(typeof field)) {
      throw new Error(`"${key}" must be a generator, a fixed value, an object, or an array configuration.`)
    }
  }
}

const validateSchemaValue = (value: Record<string, unknown>, key: string, depth: number, path: string): void => {
  assertSchemaDepth(depth, path)
  const hasItems = Object.hasOwn(value, 'items')
  const hasCount = Object.hasOwn(value, 'count')
  if (!hasItems || !hasCount) {
    validateSchemaRecord(value, depth, path)
    return
  }
  if (Object.keys(value).length !== 2)
    throw new Error(`"${key}" array configuration can only contain "items" and "count".`)
  if (!Number.isInteger(value.count) || Number(value.count) < 1 || Number(value.count) > SCHEMA_LIMITS.arrayItems) {
    throw new Error(`"${key}" needs an array count between 1 and 100.`)
  }
  assertSchemaDepth(depth + 1, `${path}[]`)
  if (isObject(value.items)) validateSchemaValue(value.items, key, depth + 1, `${path}[]`)
  else if (typeof value.items !== 'string') throw new Error(`"${key}" array items must be an object or generator name.`)
}

export const validateSchema: (value: unknown, depth?: number) => asserts value is Schema = (value, depth = 0) => {
  if (!isObject(value)) throw new Error('The schema must be a JSON object with named fields.')
  validateSchemaRecord(value, depth, '$')
}
export const parseSchema = (text: string): Schema => {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON. Check the quotes, commas, and brackets.')
  }
  validateSchema(value)
  return value
}
const inferValue = (value: unknown, key: string, depth: number, path: string): SchemaValue => {
  assertSchemaDepth(depth, path)
  if (Array.isArray(value)) {
    assertSchemaDepth(depth + 1, `${path}[]`)
    if (!value.length) return { items: 'lorem.word', count: 1 }
    return {
      items: inferValue(value[0], key, depth + 1, `${path}[]`),
      count: Math.min(value.length, SCHEMA_LIMITS.arrayItems),
    }
  }
  if (isObject(value)) return inferObject(value, depth, path)
  if (typeof value === 'boolean') return 'datatype.boolean'
  if (typeof value === 'number')
    return Number.isInteger(value)
      ? 'number.int({ min: 1, max: 100 })'
      : 'number.float({ min: 0, max: 100, fractionDigits: 2 })'
  if (value === null) return null
  return NAMED_GENERATORS.find(([pattern]) => pattern.test(normalizeFieldName(key)))?.[1] ?? 'lorem.word'
}
const inferObject = (value: Record<string, unknown>, depth: number, path: string): Schema => {
  return Object.fromEntries(
    Object.entries(value).map(([key, field]) => [key, inferValue(field, key, depth + 1, appendSchemaPath(path, key))]),
  )
}
export const importExample = (text: string): Schema => {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new Error('Paste a valid JSON object or an array of objects.')
  }
  if (Array.isArray(value)) value = value[0]
  if (!isObject(value)) throw new Error('Paste a JSON object or a non-empty array of objects.')
  const schema = inferObject(value, 0, '$')
  validateSchema(schema)
  return schema
}
export const decodeSharedSchema = (encoded: string): Schema => {
  const decoded = LZString.decompressFromEncodedURIComponent(encoded)
  let value: unknown
  try {
    value = JSON.parse(decoded || encoded)
  } catch {
    throw new Error('This shared schema could not be read.')
  }
  // Older JSON links contain the original tree editor nodes.
  if (Array.isArray(value)) value = convertToSchema(value as TreeDataNode[]).schema
  validateSchema(value)
  return value
}
export const flattenRecord = (record: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(record).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key
      return isObject(value) && Object.keys(value).length ? Object.entries(flattenRecord(value, path)) : [[path, value]]
    }),
  )
}
export const dataRows = (data: unknown): Record<string, unknown>[] => {
  return (Array.isArray(data) ? data : [data]).filter(isObject).map((record) => flattenRecord(record))
}
