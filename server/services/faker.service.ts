import { Faker } from '@faker-js/faker'
import { localeMap } from '../constant'

// Type definitions for schema structures
export interface BaseSchema {
  count?: number
  items?: GenerateSchema | string
}

export interface GenerateSchema {
  [key: string]: string | BaseSchema | GenerateSchema | boolean | number | Date
}

// Custom faker functions can be added here
const CustomFakerFunctions: Record<string, (...args: any[]) => any> = {
  // Example: customFunction: () => 'custom value'
}

/**
 * Checks if a value is a schema array
 * @param value - Value to check
 * @returns Boolean indicating if the value is a schema array
 */
const isSchemaArray = (value: any): value is BaseSchema => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    ('count' in value || 'items' in value)
  )
}

/**
 * Gets a nested function from an object by path
 * @param obj - Object to get function from
 * @param path - Dot-notation path to the function
 * @param args - Arguments to pass to the function
 * @returns The function or undefined
 */
const getNestedFunction = (obj: Record<string, any>, path: string, args: any[]): Function | undefined => {
  const parts = path.split('.')
  let current = obj

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (current[part] === undefined) {
      return undefined
    }
    current = current[part]
  }

  return typeof current === 'function' ? current : undefined
}

/**
 * Handles a string schema by calling the appropriate faker function
 * @param value - String schema value
 * @param fakerInstance - Faker instance
 * @returns Generated value
 */
const handleStringSchema = (value: string, fakerInstance: Faker): any => {
  try {
    // Handle direct values (not faker methods)
    if (!value.includes('.')) {
      return value
    }

    // Extract arguments if present
    let args: any[] = []
    if (value.includes('(') && value.includes(')')) {
      const argsMatch = value.match(/\((.*)\)/)
      if (argsMatch && argsMatch[1]) {
        // Parse arguments - this is a simple implementation
        // Could be enhanced to handle more complex argument parsing
        args = argsMatch[1].split(',').map(arg => {
          arg = arg.trim()
          // Handle numbers
          if (!isNaN(Number(arg))) {
            return Number(arg)
          }
          // Handle booleans
          if (arg === 'true') return true
          if (arg === 'false') return false
          // Handle null
          if (arg === 'null') return null
          // Handle strings (remove quotes)
          if ((arg.startsWith('"') && arg.endsWith('"')) || 
              (arg.startsWith("'") && arg.endsWith("'"))) {
            return arg.slice(1, -1)
          }
          return arg
        })
        
        // Remove arguments from the value
        value = value.substring(0, value.indexOf('('))
      }
    }

    // Get the faker function
    let fakerFunction: Function
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

/**
 * Handles a schema array by generating multiple items
 * @param value - Schema array
 * @param locale - Locale to use
 * @returns Array of generated items
 */
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

/**
 * Generates fake data based on a schema
 * @param schema - Schema to generate data from
 * @param locale - Locale to use
 * @returns Generated data object
 */
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

/**
 * Generates fake data from a template string
 * @param template - Template string with {{faker.method}} placeholders
 * @param locale - Locale to use
 * @returns Processed template string
 */
export const generateFakeDataFromTemplate = (template: string, locale: string = 'en'): string => {
  const fakerInstance = new Faker({
    locale: localeMap[locale] || localeMap['en'], // Default to 'en' if locale not found
  })

  return template.replace(/{{(.*?)}}/g, (_, key) => {
    try {
      return String(handleStringSchema(key.trim(), fakerInstance))
    } catch (error) {
      console.error('Error generating data for template key:', key, error)
      return `Error: ${key}`
    }
  })
}
