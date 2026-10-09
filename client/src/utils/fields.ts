import JSON5 from 'json5'
import { commonMethods } from '@/constants/fields'
import type { SelectOption } from '@/types/ui'
import type { FakerMethodCategory } from '@/types/faker'
import type { SchemaValue } from '@/types/schema'
import type { Schema } from '@/types/schema'
import type { FieldSummary, RemovedField } from '@/types/field-editor'
import { isArraySchema, isObject } from '@/utils/schema'

export const isFixedFieldValue = (value: SchemaValue): boolean =>
  typeof value === 'number' ||
  typeof value === 'boolean' ||
  value === null ||
  (typeof value === 'string' && (!value.includes('.') || value.startsWith('custom.literal(')))

export const getFieldOptions = (value: SchemaValue, methods: FakerMethodCategory[], depth: number): SelectOption[] => {
  const custom: SelectOption[] = []
  const isFixed = isFixedFieldValue(value)
  const expressionMethod = typeof value === 'string' ? value.match(/^([\w]+\.[\w]+)\s*\(/)?.[1] : undefined
  const known = new Set([
    ...commonMethods.map(([method]) => method),
    ...methods.flatMap((group) => group.items.map((item) => item.method)),
  ])

  if (typeof value === 'string' && !isFixed && (!known.has(value) || expressionMethod !== undefined)) {
    custom.push({
      value,
      label: value,
      description: expressionMethod ? 'Current generator with arguments' : 'Current custom value',
    })
  }

  return [
    ...commonMethods.map(([method, label]) => ({ value: method, label })),
    ...methods.flatMap((group) =>
      group.items
        .filter((item) => !commonMethods.some(([method]) => method === item.method))
        .map((item) => ({ value: item.method, label: item.method, description: item.description })),
    ),
    ...(depth < 12
      ? [
          { value: '$object', label: 'Nested object' },
          { value: '$array', label: 'Array' },
        ]
      : []),
    { value: '$fixed', label: 'Fixed value' },
    ...custom,
  ]
}

export const getArrayItemOptions = (
  value: SchemaValue,
  methods: FakerMethodCategory[],
  depth: number,
): SelectOption[] => {
  const options = getFieldOptions(value, methods, depth).filter(
    (option) => option.value !== '$fixed' && option.value !== '$array',
  )
  if (typeof value === 'string' && isFixedFieldValue(value)) {
    options.push({ value, label: getFixedPrimitive(value), description: 'Current fixed array item' })
  }
  return options
}

export const getFixedPrimitive = (value: SchemaValue): string => {
  if (typeof value !== 'string' || !value.startsWith('custom.literal(')) return JSON.stringify(value) ?? 'null'
  const raw = value.slice('custom.literal('.length, value.endsWith(')') ? -1 : undefined)
  try {
    return JSON.stringify(JSON5.parse(raw)) ?? 'null'
  } catch {
    return raw
  }
}

export const parseFixedPrimitive = (text: string): { value?: string | number | boolean | null; error?: string } => {
  try {
    const parsed: unknown = JSON.parse(text)
    if (parsed === null || typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean')
      return { value: parsed }
    return { error: 'Use a JSON string, number, boolean, or null.' }
  } catch {
    return { error: 'Enter a valid JSON string, number, boolean, or null.' }
  }
}

export const isKnownFieldGenerator = (value: string, methods: FakerMethodCategory[]): boolean => {
  const method = value.match(/^([\w]+\.[\w]+)\s*\(/)?.[1] ?? value
  return (
    commonMethods.some(([candidate]) => candidate === method) ||
    methods.some((group) => group.items.some((item) => item.method === method))
  )
}

export const isValidFieldSchema = (schema: SchemaValue, methods: FakerMethodCategory[], depth = 0): boolean => {
  if (depth > 12) return false
  if (isArraySchema(schema)) {
    if (!Number.isInteger(schema.count) || schema.count < 1 || schema.count > 100) return false
    if (isObject(schema.items)) return isValidFieldSchema(schema.items as SchemaValue, methods, depth + 1)
    return (
      typeof schema.items === 'string' &&
      (isFixedFieldValue(schema.items)
        ? !parseFixedPrimitive(getFixedPrimitive(schema.items)).error
        : isKnownFieldGenerator(schema.items, methods))
    )
  }
  if (isObject(schema)) {
    const entries = Object.entries(schema)
    return entries.every(
      ([key, value]) =>
        key.trim().length > 0 &&
        !['__proto__', 'constructor', 'prototype'].includes(key) &&
        isValidFieldSchema(value as SchemaValue, methods, depth + 1),
    )
  }
  if (typeof schema === 'string') {
    if (isFixedFieldValue(schema)) return !parseFixedPrimitive(getFixedPrimitive(schema)).error
    return isKnownFieldGenerator(schema, methods)
  }
  return schema === null || (typeof schema === 'number' && Number.isFinite(schema)) || typeof schema === 'boolean'
}

export const getFieldSummary = (value: SchemaValue, methods: FakerMethodCategory[]): FieldSummary => {
  if (isArraySchema(value)) {
    const itemLabel = isObject(value.items) ? 'object items' : String(value.items)
    return { kind: 'array', label: 'Array', detail: `${value.count} items · ${itemLabel}`, nested: true }
  }
  if (isObject(value)) {
    const fieldCount = Object.keys(value).length
    return {
      kind: 'object',
      label: 'Object',
      detail: `${fieldCount} ${fieldCount === 1 ? 'field' : 'fields'}`,
      nested: true,
    }
  }
  if (isFixedFieldValue(value)) {
    return { kind: 'fixed', label: 'Fixed value', detail: getFixedPrimitive(value), nested: false }
  }
  if (typeof value === 'string' && isKnownFieldGenerator(value, methods)) {
    const method = value.match(/^([\w]+\.[\w]+)\s*\(/)?.[1] ?? value
    const metadata = methods.flatMap((category) => category.items).find((item) => item.method === method)
    return {
      kind: 'generator',
      label: 'Faker',
      detail: metadata?.description ? `${value} · ${metadata.description}` : value,
      nested: false,
    }
  }
  return { kind: 'custom', label: 'Custom source', detail: String(value), nested: false }
}

export const getDuplicateFieldName = (name: string, schema: Schema): string => {
  const base = `${name}_copy`
  if (!Object.hasOwn(schema, base)) return base
  let suffix = 2
  while (Object.hasOwn(schema, `${base}_${suffix}`)) suffix++
  return `${base}_${suffix}`
}

export const duplicateField = (schema: Schema, name: string): { schema: Schema; name: string } => {
  const entries = Object.entries(schema)
  const index = entries.findIndex(([fieldName]) => fieldName === name)
  if (index < 0) return { schema, name }
  const duplicateName = getDuplicateFieldName(name, schema)
  entries.splice(index + 1, 0, [duplicateName, structuredClone(schema[name])])
  return { schema: Object.fromEntries(entries), name: duplicateName }
}

export const moveField = (schema: Schema, name: string, offset: -1 | 1): Schema => {
  const entries = Object.entries(schema)
  const index = entries.findIndex(([fieldName]) => fieldName === name)
  const nextIndex = index + offset
  if (index < 0 || nextIndex < 0 || nextIndex >= entries.length) return schema
  ;[entries[index], entries[nextIndex]] = [entries[nextIndex], entries[index]]
  return Object.fromEntries(entries)
}

export const restoreRemovedField = (schema: Schema, removed: RemovedField): { schema: Schema; name: string } => {
  let name = removed.name
  if (Object.hasOwn(schema, name)) {
    const base = `${name}_restored`
    name = base
    let suffix = 2
    while (Object.hasOwn(schema, name)) name = `${base}_${suffix++}`
  }
  const entries = Object.entries(schema)
  entries.splice(Math.max(0, Math.min(removed.index, entries.length)), 0, [name, removed.value])
  return { schema: Object.fromEntries(entries), name }
}
