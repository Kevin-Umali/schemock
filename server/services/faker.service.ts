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
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date) && ('count' in value || 'items' in value)
}

/**
 * Gets a nested function from an object by path
 * @param obj - Object to get function from
 * @param path - Dot-notation path to the function
 * @param args - Arguments to pass to the function
 * @returns The function or undefined
 */
const getNestedFunction = (obj: Record<string, any>, path: string, _args: any[]): Function | undefined => {
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
        args = argsMatch[1].split(',').map((arg) => {
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
          if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
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
/**
 * Formats an object into a readable paragraph
 * @param obj - Object to format
 * @param prefix - Prefix for nested properties
 * @returns Formatted paragraph string
 */
/**
 * Formats an object into a readable paragraph
 * @param obj - Object to format
 * @param prefix - Prefix for nested properties
 * @param depth - Current nesting depth
 * @returns Formatted paragraph string
 */
const formatObjectToParagraph = (obj: any, prefix: string = '', depth: number = 0): string => {
  if (obj === null || obj === undefined) {
    return 'null'
  }

  if (typeof obj !== 'object') {
    return String(obj)
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return 'empty list'
    }

    // For short arrays with primitive values, use a simple comma-separated list
    if (obj.length <= 3 && obj.every((item) => typeof item !== 'object' || item === null)) {
      return obj.map((item) => String(item)).join(', ')
    }

    // For longer or complex arrays, format each item on a new line
    return obj
      .map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return `Item ${index + 1}: ${formatObjectToParagraph(item, '', depth + 1)}`
        }
        return `Item ${index + 1}: ${String(item)}`
      })
      .join('; ')
  }

  // Handle objects
  const parts: string[] = []
  const entries = Object.entries(obj)

  // If it's an empty object
  if (entries.length === 0) {
    return 'empty object'
  }

  for (const [key, value] of entries) {
    const propertyName = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // For nested objects, format recursively
      const nestedObj = formatObjectToParagraph(value, propertyName, depth + 1)
      parts.push(`${key}: ${nestedObj}`)
    } else if (Array.isArray(value)) {
      // For arrays, list items
      const arrayStr = formatObjectToParagraph(value, propertyName, depth + 1)
      parts.push(`${key}: ${arrayStr}`)
    } else {
      // For primitive values
      parts.push(`${key}: ${value}`)
    }
  }

  // Use different separators based on depth and number of properties
  if (depth > 0 && entries.length > 2) {
    // For nested objects with many properties, use semicolons
    return parts.join('; ')
  } else if (depth === 0 && entries.length > 3) {
    // For top-level objects with many properties, use periods to create sentences
    return parts.join('. ')
  } else {
    // For simple objects, use commas
    return parts.join(', ')
  }
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
