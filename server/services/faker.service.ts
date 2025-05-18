import { Faker } from '@faker-js/faker'
import { localeMap } from '../constant'
import { generateSuggestion } from '../utils/error-suggestion'

// Type definitions for schema structures
export interface BaseSchema {
  count?: number
  items?: GenerateSchema | string
}

export interface GenerateSchema {
  [key: string]: string | BaseSchema | GenerateSchema | boolean | number | Date
}

// Custom faker functions with improved type safety
interface CustomFakerFunction {
  (...args: any[]): any
}

const CustomFakerFunctions: Record<string, CustomFakerFunction> = {
  customFunction: () => 'Custom Value',
  date: (...args: any[]) => {
    // Handle date with a single string/number argument
    if (args.length === 1 && (typeof args[0] === 'string' || typeof args[0] === 'number')) {
      return new Date(args[0])
    }

    // Handle date with multiple numeric arguments (year, month, day, etc.)
    if (args.length > 1 && args.every((arg) => typeof arg === 'number' || arg === undefined)) {
      const [year, month, day, hour, minute, second, millisecond] = args
      return new Date(year, month ?? 0, day ?? 1, hour ?? 0, minute ?? 0, second ?? 0, millisecond ?? 0)
    }

    // Default to current date
    return new Date()
  },
}

/**
 * Checks if a value is a schema array
 * @param value - Value to check
 * @returns Boolean indicating if the value is a schema array
 */
const isSchemaArray = (value: any): value is BaseSchema => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date) && ('count' in value || 'items' in value)
}

/**
 * Gets a nested function from an object by path
 * @param obj - Object to get function from
 * @param path - Dot-notation path to the function
 * @returns The function or undefined
 */
const getNestedFunction = (obj: Record<string, any>, path: string): Function | undefined => {
  // Handle direct values (not faker methods)
  if (!path.includes('.')) {
    return undefined
  }

  // Navigate through the object using the path
  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current[part] === undefined) {
      const suggestion = generateSuggestion?.(path) ?? "Can't find this path, please check the documentation https://fakerjs.dev/api/"
      throw new Error(`Path ${path} is invalid at part ${part}. ${suggestion}`)
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
    let methodPath = value

    const argStartIndex = value.indexOf('(')
    const argEndIndex = value.lastIndexOf(')')

    if (argStartIndex !== -1 && argEndIndex !== -1 && argEndIndex > argStartIndex) {
      const argsString = value.slice(argStartIndex + 1, argEndIndex)

      // Parse arguments with proper handling of different types
      if (argsString.trim()) {
        args = argsString.split(',').map((arg) => {
          const trimmed = arg.trim()

          // Handle numbers
          if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
            return Number(trimmed)
          }

          // Handle booleans
          if (trimmed === 'true') return true
          if (trimmed === 'false') return false

          // Handle null
          if (trimmed === 'null') return null

          // Handle strings with quotes
          if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1)
          }

          // Default to treating as a string
          return trimmed
        })
      }

      // Remove arguments from the value
      methodPath = value.slice(0, argStartIndex)
    }

    // Get the faker function
    let fakerFunction: Function | undefined

    if (methodPath.startsWith('custom.')) {
      const customFunctionKey = methodPath.split('.')[1]
      fakerFunction = CustomFakerFunctions[customFunctionKey]
      if (!fakerFunction) {
        throw new Error(`Custom faker function not found: ${customFunctionKey}`)
      }
    } else {
      fakerFunction = getNestedFunction(fakerInstance as unknown as Record<string, any>, methodPath)
      if (!fakerFunction) {
        throw new Error(`Faker function not found: ${methodPath}`)
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
/**
 * Formats an object into a readable paragraph
 * @param obj - Object to format
 * @param prefix - Prefix for nested properties
 * @returns Formatted paragraph string
 */
/**
 * Formats a primitive value to string
 * @param value - Value to format
 * @returns Formatted string
 */
const formatPrimitiveValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'null'
  }
  return String(value)
}

/**
 * Formats an array into a readable string
 * @param arr - Array to format
 * @param depth - Current nesting depth
 * @returns Formatted string
 */
const formatArray = (arr: any[], depth: number): string => {
  if (arr.length === 0) {
    return 'empty list'
  }

  // For short arrays with primitive values, use a simple comma-separated list
  if (arr.length <= 3 && arr.every((item) => typeof item !== 'object' || item === null)) {
    return arr.map(formatPrimitiveValue).join(', ')
  }

  // For longer or complex arrays, format each item on a new line
  return arr
    .map((item, index) => {
      if (typeof item === 'object' && item !== null) {
        return `Item ${index + 1}: ${formatObjectToParagraph(item, '', depth + 1)}`
      }
      return `Item ${index + 1}: ${formatPrimitiveValue(item)}`
    })
    .join('; ')
}

/**
 * Formats a key-value pair into a readable string
 * @param key - Object key
 * @param value - Object value
 * @param prefix - Prefix for nested properties
 * @param depth - Current nesting depth
 * @returns Formatted string
 */
const formatKeyValuePair = (key: string, value: any, prefix: string, depth: number): string => {
  const propertyName = prefix ? `${prefix}.${key}` : key

  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      // For arrays, list items
      return `${key}: ${formatArray(value, depth + 1)}`
    } else {
      // For nested objects, format recursively
      return `${key}: ${formatObjectToParagraph(value, propertyName, depth + 1)}`
    }
  } else {
    // For primitive values
    return `${key}: ${formatPrimitiveValue(value)}`
  }
}

/**
 * Formats an object's entries into a readable string
 * @param entries - Object entries to format
 * @param prefix - Prefix for nested properties
 * @param depth - Current nesting depth
 * @returns Formatted string
 */
const formatObjectEntries = (entries: [string, any][], prefix: string, depth: number): string => {
  // Map each entry to a formatted string
  const parts = entries.map(([key, value]) => formatKeyValuePair(key, value, prefix, depth))

  // Choose separator based on depth and complexity
  if (depth > 0 && entries.length > 2) {
    return parts.join('; ') // Semicolons for nested complex objects
  } else if (depth === 0 && entries.length > 3) {
    return parts.join('. ') // Periods for top-level complex objects
  } else {
    return parts.join(', ') // Commas for simple objects
  }
}

/**
 * Formats an object into a readable paragraph
 * @param obj - Object to format
 * @param prefix - Prefix for nested properties
 * @param depth - Current nesting depth
 * @returns Formatted paragraph string
 */
const formatObjectToParagraph = (obj: any, prefix: string = '', depth: number = 0): string => {
  // Handle non-objects
  if (obj === null || obj === undefined) {
    return 'null'
  }

  if (typeof obj !== 'object') {
    return String(obj)
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return formatArray(obj, depth)
  }

  // Handle objects
  const entries = Object.entries(obj)
  if (entries.length === 0) {
    return 'empty object'
  }

  return formatObjectEntries(entries, prefix, depth)
}

/**
 * Generates fake data from a template string
 * @param template - Template string with {{faker.method}} placeholders
 * @param locale - Locale to use
 * @param formatObjects - Whether to format objects as paragraphs
 * @returns Processed template string
 */
export const generateFakeDataFromTemplate = (template: string, locale: string = 'en', formatObjects: boolean = true): string => {
  const fakerInstance = new Faker({
    locale: localeMap[locale] || localeMap['en'], // Default to 'en' if locale not found
  })

  return template.replace(/{{(.*?)}}/g, (_, key) => {
    try {
      const value = handleStringSchema(key.trim(), fakerInstance)

      // Handle different types of values
      if (value === null || value === undefined) {
        return 'null'
      }

      if (typeof value === 'object') {
        // Format objects as readable paragraphs or JSON strings
        if (formatObjects) {
          return formatObjectToParagraph(value)
        } else {
          return JSON.stringify(value)
        }
      }

      return String(value)
    } catch (error) {
      console.error('Error generating data for template key:', key, error)
      return `Error: ${key}`
    }
  })
}
