import { REQUEST_LIMITS, RESERVED_KEYS } from '../constant/security'
import { HTTPException } from 'hono/http-exception'
export const assertSchemaLimits = (schema: unknown, count = 1): void => {
  let cost = 0
  const visit = (value: unknown, depth: number, multiplier: number, rootRecord = false): void => {
    if (depth > REQUEST_LIMITS.schemaDepth)
      throw new HTTPException(422, { message: 'Schemas support up to 12 levels of nesting.' })
    cost += multiplier
    if (cost > REQUEST_LIMITS.generatedValues)
      throw new HTTPException(422, {
        message: 'This schema would generate too much data. Reduce the record count or nested array sizes.',
      })
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value))
      throw new HTTPException(422, { message: 'Use an items/count configuration for schema arrays.' })

    const object = value as Record<string, unknown>
    const hasItems = Object.hasOwn(object, 'items')
    const hasCount = Object.hasOwn(object, 'count')
    if (!rootRecord && hasItems && hasCount) {
      if (Object.keys(object).length !== 2)
        throw new HTTPException(422, {
          message: 'Array configurations can only contain the "items" and "count" fields.',
        })
      const size = object.count
      if (!Number.isInteger(size) || Number(size) < 1 || Number(size) > REQUEST_LIMITS.arrayItems)
        throw new HTTPException(422, { message: 'Array counts must be integers between 1 and 100.' })
      visit(object.items, depth + 1, multiplier * Number(size))
      return
    }

    const entries = Object.entries(object)
    if (entries.length > REQUEST_LIMITS.fieldsPerObject)
      throw new HTTPException(422, { message: 'Use no more than 100 fields per object.' })
    for (const [key, field] of entries) {
      if (RESERVED_KEYS.has(key)) throw new HTTPException(422, { message: `Field name "${key}" is reserved.` })
      visit(field, depth + 1, multiplier)
    }
  }
  visit(schema, 0, count, true)
}
