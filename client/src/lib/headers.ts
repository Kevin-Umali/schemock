/**
 * Utility functions for working with HTTP headers
 */

/**
 * Creates headers for flattening complex objects
 * @param shouldFlatten - Whether to flatten complex objects
 * @returns Headers object with flattening configuration
 */
export const createFlattenHeaders = (shouldFlatten: boolean): Record<string, string> => {
  const headers: Record<string, string> = {}
  
  if (shouldFlatten) {
    headers['X-Flatten-Objects'] = 'true'
  }
  
  return headers
}

/**
 * Creates headers for formatting complex objects
 * @param shouldFormat - Whether to format complex objects
 * @returns Headers object with formatting configuration
 */
export const createFormatHeaders = (shouldFormat: boolean): Record<string, string> => {
  const headers: Record<string, string> = {}
  
  if (shouldFormat) {
    headers['X-Format-Objects'] = 'true'
  }
  
  return headers
}

/**
 * Combines multiple header objects into a single headers object
 * @param headersList - List of header objects to combine
 * @returns Combined headers object
 */
export const combineHeaders = (...headersList: Record<string, string>[]): Record<string, string> => {
  return headersList.reduce((combined, headers) => {
    return { ...combined, ...headers }
  }, {})
}
