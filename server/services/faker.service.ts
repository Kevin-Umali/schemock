import { REQUEST_LIMITS } from '../constant/security'
import { HTTPException } from 'hono/http-exception'
import { assertSchemaLimits } from './schema-limits'
import { createFaker, generateValue } from './faker-method'
import { formatObjectToParagraph } from './template-formatter'
export type GenerateSchema = Record<string, unknown>
export interface BaseSchema {
  count?: number
  items?: GenerateSchema | string
}
const createGenerator = (locale: string) => {
  const faker = createFaker(locale)
  const generate = (value: unknown): unknown => {
    if (typeof value === 'string') {
      try {
        value = generateValue(value, faker)
      } catch (error) {
        throw new HTTPException(422, { message: (error as Error).message })
      }
    } else if (value && typeof value === 'object') {
      const object = value as Record<string, unknown>
      if ('items' in object && 'count' in object)
        return Array.from({ length: Number(object.count) }, () => generate(object.items))
      return Object.fromEntries(Object.entries(object).map(([key, field]) => [key, generate(field)]))
    }
    const length = typeof value === 'string' ? value.length : 0
    if (length > REQUEST_LIMITS.valueCharacters)
      throw new HTTPException(422, {
        message: 'A generated value is too large. Reduce generator lengths.',
      })
    return value
  }
  return generate
}
export const generateFakeRecords = (
  schema: GenerateSchema,
  count: number,
  locale = 'en',
): Record<string, unknown>[] => {
  assertSchemaLimits(schema, count)
  const generate = createGenerator(locale)
  let responseSize = 0
  return Array.from({ length: count }, () => {
    const record = Object.fromEntries(Object.entries(schema).map(([key, value]) => [key, generate(value)]))
    responseSize += JSON.stringify(record).length
    if (responseSize > REQUEST_LIMITS.responseCharacters)
      throw new HTTPException(422, {
        message: 'Generated output is too large. Reduce generator lengths or the record count.',
      })
    return record
  })
}
export const generateFakeData = (schema: GenerateSchema, locale = 'en'): Record<string, unknown> => {
  return generateFakeRecords(schema, 1, locale)[0]
}
export const generateTemplates = (template: string, count: number, locale = 'en', formatObjects = true): string[] => {
  const placeholders = [...template.matchAll(/{{([\s\S]*?)}}/g)].length
  if (placeholders * count > REQUEST_LIMITS.generatedValues)
    throw new HTTPException(422, { message: 'This template has too many placeholders. Reduce the variation count.' })
  const generate = createGenerator(locale)
  let size = 0
  return Array.from({ length: count }, () => {
    const text = template.replace(/{{([\s\S]*?)}}/g, (_, expression: string) => {
      const value = generate(expression.trim())
      if (value === null || value === undefined) return 'null'
      if (typeof value === 'object') return formatObjects ? formatObjectToParagraph(value) : JSON.stringify(value)
      return String(value)
    })
    size += text.length
    if (size > REQUEST_LIMITS.responseCharacters)
      throw new HTTPException(422, { message: 'Generated text is too large. Reduce the variation count.' })
    return text
  })
}
export const generateFakeDataFromTemplate = (template: string, locale = 'en', formatObjects = true): string => {
  return generateTemplates(template, 1, locale, formatObjects)[0]
}
