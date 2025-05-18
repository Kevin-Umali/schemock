import Fuse from 'fuse.js'
import { FakerMethods } from '../constant'
import { ZodIssueCode, type ZodIssue } from 'zod'

// Create a searchable index of valid faker methods
const validFakerMethods = FakerMethods.options.map((method) => ({
  type: 'method',
  value: method,
}))

// Initialize Fuse.js for fuzzy searching
const fuse = new Fuse(validFakerMethods, {
  keys: ['value'],
  includeScore: true,
  threshold: 0.4,
  distance: 100,
  useExtendedSearch: true,
})

/**
 * Formats a Zod validation error into a readable message
 * @param issue - Zod validation issue
 * @returns Human-readable error message or null
 */
export const formatToReadableError = (issue: ZodIssue): string | null => {
  const pathString = issue.path.join('.')
  
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === 'undefined') {
        return `The field '${pathString}' is required.`
      }
      return `Expected '${pathString}' to be ${issue.expected}, but received ${issue.received}.`
      
    case ZodIssueCode.invalid_enum_value:
      const options = issue.options as string[]
      const suggestion = generateSuggestion(issue.received as string)
      return `'${issue.received}' is not a valid option for '${pathString}'. Valid options are: ${options.join(', ')}. ${suggestion || ''}`
      
    case ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return `'${pathString}' must be a valid email address.`
      }
      if (issue.validation === 'url') {
        return `'${pathString}' must be a valid URL.`
      }
      return issue.message
      
    case ZodIssueCode.too_small:
      const minimum = issue.minimum
      if (issue.type === 'string') {
        return `'${pathString}' must contain at least ${minimum} character${minimum === 1 ? '' : 's'}.`
      }
      if (issue.type === 'number') {
        return `'${pathString}' must be greater than or equal to ${minimum}.`
      }
      if (issue.type === 'array') {
        return `'${pathString}' must contain at least ${minimum} item${minimum === 1 ? '' : 's'}.`
      }
      return issue.message
      
    case ZodIssueCode.too_big:
      const maximum = issue.maximum
      if (issue.type === 'string') {
        return `'${pathString}' must contain at most ${maximum} character${maximum === 1 ? '' : 's'}.`
      }
      if (issue.type === 'number') {
        return `'${pathString}' must be less than or equal to ${maximum}.`
      }
      if (issue.type === 'array') {
        return `'${pathString}' must contain at most ${maximum} item${maximum === 1 ? '' : 's'}.`
      }
      return issue.message
      
    default:
      return issue.message
  }
}

/**
 * Generates a suggestion for an invalid value
 * @param path - The invalid value
 * @returns Suggestion string or null
 */
export const generateSuggestion = (path: string): string | null => {
  const extendedSearchQuery = `^${path} | ${path} | =${path}`

  const result = fuse.search(extendedSearchQuery)

  if (result.length > 0 && result[0]?.score !== undefined && result[0].score < 0.4) {
    return `Did you mean '${result[0].item.value}' (${result[0].item.type})?`
  }

  return null
}
