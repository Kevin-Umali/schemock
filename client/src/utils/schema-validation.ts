import { GENERATOR_EXPRESSION } from '@/constants/schema-editor'
import type { FakerMethodCategory } from '@/types/faker'
import type { SchemaCheck } from '@/types/schema-editor'
import { isObject, parseSchema } from '@/utils/schema'
import JSON5 from 'json5'

export const generatorIssue = (value: string, allowed: Set<string>): string | undefined => {
  if (!value.includes('.')) return
  const match = GENERATOR_EXPRESSION.exec(value)
  if (!match) return 'Use a generator like person.fullName, or custom.literal("your text") for a fixed string.'
  const method = `${match[1]}.${match[2]}`
  if (!allowed.has(method)) return `Unknown generator “${method}”. Choose a suggestion or check the reference.`
  if (method === 'custom.literal' && match[3] === undefined)
    return 'custom.literal needs a value, for example custom.literal("Draft").'
  if (match[3] !== undefined) {
    try {
      const args: unknown[] = JSON5.parse(`[${match[3]}]`)
      if (
        method === 'custom.literal' &&
        (args.length !== 1 || (args[0] !== null && !['string', 'number', 'boolean'].includes(typeof args[0])))
      ) {
        return 'custom.literal needs one fixed string, number, boolean, or null.'
      }
    } catch {
      return 'Invalid generator arguments. Use JSON values, for example number.int({ min: 1, max: 100 }).'
    }
  }
}

export const checkSchema = (text: string, methods: FakerMethodCategory[]): SchemaCheck => {
  try {
    const schema = parseSchema(text)
    const allowed = new Set(methods.flatMap((category) => category.items.map((item) => item.method)))
    const issues: SchemaCheck['issues'] = []
    const visit = (value: unknown) => {
      if (typeof value === 'string') {
        const message = generatorIssue(value, allowed)
        if (message) issues.push({ message, value })
      } else if (isObject(value)) {
        Object.entries(value).forEach(([key, field]) => {
          if (key !== 'count' || !('items' in value)) visit(field)
        })
      }
    }
    visit(schema)
    if (!Object.keys(schema).length) issues.push({ message: 'Add at least one field before generating.' })
    return { schema: issues.length ? undefined : schema, issues }
  } catch (error) {
    return { issues: [{ message: (error as Error).message }] }
  }
}
