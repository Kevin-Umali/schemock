import Fuse from 'fuse.js'
import { FakerMethods } from '../constant'
import { type ZodIssue } from 'zod'
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
export const formatToReadableError = (issue: ZodIssue): string =>
  `${issue.path.join('.') || 'request'}: ${issue.message}`
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
