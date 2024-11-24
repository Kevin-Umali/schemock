import { Faker } from '@faker-js/faker'
import { localeMap } from '../constant'
import { generateSuggestion } from './error-suggestion'

interface BaseSchema {
  count?: number
  items?: GenerateSchema | string
}

interface GenerateSchema {
  [key: string]: string | BaseSchema | GenerateSchema | boolean | number | Date
}

const CustomFakerFunctions: { [key: string]: (...args: any[]) => any } = {
  customFunction: () => 'Custom Value',
  date: (...args: any[]) => {
    if (args.length === 1 && (typeof args[0] === 'string' || typeof args[0] === 'number')) {
      return new Date(args[0])
    }
    if (args.length > 1 && args.every((arg) => typeof arg === 'number' || arg === undefined)) {
      const [year, month, day, hour, minute, second, millisecond] = args
      return new Date(year, month ?? 0, day ?? 1, hour ?? 0, minute ?? 0, second ?? 0, millisecond ?? 0)
    }

    return new Date()
  },
}

const isSchemaArray = (value: unknown): value is BaseSchema => {
  return typeof value === 'object' && value !== null && ('items' in value || 'count' in value)
}

const parseArgs = (argsString: string): any[] => {
  try {
    // Safely parse the arguments using a function constructor to avoid security risks
    const args = Function(`"use strict"; return [${argsString}]`)()
    return args
  } catch {
    throw new Error(`Error parsing arguments: ${argsString}`)
  }
}

const getNestedFunction = (obj: Record<string, any>, path: string, args: any[]): (() => any) => {
  const parts = path.split('.')
  if (parts.length === 1) {
    return () => path
  }

  const nestedFunction = parts.reduce((acc: any, part: string) => {
    if (acc && acc[part] !== undefined) {
      return acc[part]
    }
    const suggestion = generateSuggestion(path) ?? "Can't find suggestion for this path, please check the documentation https://fakerjs.dev/api/"
    throw new Error(`Path ${path} is invalid at part ${part}. ${suggestion}`)
  }, obj)

  return () => nestedFunction(...args)
}

const handleStringSchema = (value: string, fakerInstance: Faker): any => {
  try {
    let fakerFunction: (...args: any[]) => any
    let args: any[] = []

    const argStartIndex = value.indexOf('(')
    const argEndIndex = value.indexOf(')')

    if (argStartIndex !== -1 && argEndIndex !== -1 && argEndIndex > argStartIndex) {
      const argsString = value.slice(argStartIndex + 1, argEndIndex)
      args = parseArgs(argsString)
      value = value.slice(0, argStartIndex)
    }

    if (value.startsWith('custom.')) {
      const customFunctionKey = value.split('.')[1]
      fakerFunction = CustomFakerFunctions[customFunctionKey]
      if (!fakerFunction) {
        throw new Error(`Custom faker function not found: ${customFunctionKey}`)
      }
    } else {
      fakerFunction = getNestedFunction(fakerInstance as unknown as Record<string, any>, value, args) as (...args: any[]) => any
      if (typeof fakerFunction !== 'function') {
        throw new Error(`Faker function not found: ${value}`)
      }
    }

    return fakerFunction(...args)
  } catch (error) {
    return (error as Error)?.message || value
  }
}

const handleSchemaArray = (value: BaseSchema, locale: string): any[] => {
  const count = value.count ?? 1

  if (!value.items) {
    return []
  }

  const fakerInstance = new Faker({
    locale: localeMap[locale] || localeMap['en'],
  })

  return Array.from({ length: count }, () => {
    if (typeof value.items === 'string') {
      return handleStringSchema(value.items, fakerInstance)
    } else {
      return generateFakeData(value.items as GenerateSchema, locale)
    }
  })
}

export const generateFakeData = (schema: GenerateSchema, locale: string = 'en'): Record<string, any> => {
  const fakerInstance = new Faker({
    locale: localeMap[locale] || localeMap['en'], // Default to 'en' if locale not found
  })

  const fakeData: Record<string, any> = {}

  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'string') {
      fakeData[key] = handleStringSchema(value, fakerInstance)
    } else if (isSchemaArray(value)) {
      fakeData[key] = handleSchemaArray(value, locale)
    } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      fakeData[key] = generateFakeData(value, locale)
    } else {
      // Directly assign primitive values (boolean, number, date)
      fakeData[key] = value
    }
  }

  return fakeData
}

export const generateFakeDataFromTemplate = (template: string, locale: string = 'en'): string => {
  const fakerInstance = new Faker({
    locale: localeMap[locale] || localeMap['en'], // Default to 'en' if locale not found
  })

  return template.replace(/{{(.*?)}}/g, (_, key) => {
    try {
      return handleStringSchema(key.trim(), fakerInstance)
    } catch (error) {
      console.log(error)
      return `Error generating data for key: ${key}`
    }
  })
}
