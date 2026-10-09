const formatPrimitiveValue = (value: unknown): string => {
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
const formatArray = (arr: unknown[], depth: number): string => {
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
const formatKeyValuePair = (key: string, value: unknown, prefix: string, depth: number): string => {
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
const formatObjectEntries = (entries: [string, unknown][], prefix: string, depth: number): string => {
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
export const formatObjectToParagraph = (obj: unknown, prefix: string = '', depth: number = 0): string => {
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
