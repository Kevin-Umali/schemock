import { checkArguments } from '../utils/generator-arguments'
import { REQUEST_LIMITS } from '../constant/security'
import { SAFE_EMAIL_DOMAIN } from '../constant/security'
import { Faker, en, base } from '@faker-js/faker'
import JSON5 from 'json5'
import { allowedFakerMethods, localeMap } from '../constant'
export const createFaker = (locale = 'en'): Faker => {
  return new Faker({ locale: [localeMap[locale] || en, en, base] })
}
export const generateValue = (expression: string, faker: Faker): unknown => {
  const match = /^([a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*)(?:\(([\s\S]*)\))?$/.exec(expression.trim())
  if (!match) {
    if (!expression.includes('.')) return expression
    throw new Error(`Invalid generator: ${expression}`)
  }
  const [, method, argumentText] = match
  if (!allowedFakerMethods.has(method)) throw new Error(`Unknown generator: ${method}. Check the method reference.`)
  let args: unknown[] = []
  if (argumentText?.trim()) {
    if (argumentText.length > REQUEST_LIMITS.argumentCharacters) throw new Error('Generator arguments are too long.')
    try {
      args = JSON5.parse(`[${argumentText}]`)
    } catch {
      throw new Error(`Invalid arguments for ${method}. Use JSON values; code is not allowed.`)
    }
    if (method !== 'custom.date')
      args.forEach((value) => checkArguments(value, 0, '', /^(lorem|string|word|helpers)\./.test(method)))
  }
  if (method === 'internet.email' || method === 'internet.exampleEmail') {
    if (args.length > 1 || (args.length === 1 && (!args[0] || typeof args[0] !== 'object' || Array.isArray(args[0]))))
      throw new Error('Email generators accept an options object.')
    return faker.internet.email({ ...(args[0] as Record<string, unknown> | undefined), provider: SAFE_EMAIL_DOMAIN })
  }
  if (method === 'custom.literal') {
    if (args.length !== 1 || (args[0] !== null && !['string', 'number', 'boolean'].includes(typeof args[0])))
      throw new Error('custom.literal accepts one fixed scalar value.')
    return args[0]
  }
  if (method === 'custom.customFunction') return 'Custom Value'
  if (method === 'custom.date') {
    if (args.length === 1 && (typeof args[0] === 'number' || typeof args[0] === 'string')) {
      const date = new Date(args[0])
      if (!Number.isFinite(date.getTime())) throw new Error('Invalid date argument.')
      return date
    }
    if (
      args.length >= 2 &&
      args.length <= 7 &&
      args.every((value) => typeof value === 'number' && Number.isFinite(value))
    ) {
      const [year, month, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0] = args as number[]
      const date = new Date(year, month, day, hour, minute, second, millisecond)
      if (!Number.isFinite(date.getTime())) throw new Error('Invalid date arguments.')
      return date
    }
    if (!args.length) return new Date()
    throw new Error('Use a date string, timestamp, or numeric date parts.')
  }
  const [category, name] = method.split('.')
  const module = (faker as unknown as Record<string, Record<string, (...args: unknown[]) => unknown>>)[category]
  const result = module[name](...args)
  return typeof result === 'bigint' ? result.toString() : result
}
