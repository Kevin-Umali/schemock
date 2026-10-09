import { REQUEST_LIMITS, RESERVED_KEYS } from '../constant/security'
export const checkArguments = (value: unknown, depth = 0, key = '', allocation = false): void => {
  if (depth > REQUEST_LIMITS.argumentDepth) throw new Error('Generator arguments are nested too deeply.')
  if (
    typeof value === 'number' &&
    (!Number.isFinite(value) || ((key === '' || allocation) && Math.abs(value) > REQUEST_LIMITS.argumentSize))
  )
    throw new Error('Numeric generator arguments must be finite and bounded.')
  if (typeof value === 'string' && value.length > REQUEST_LIMITS.argumentSize)
    throw new Error('Generator argument strings must be at most 1000 characters.')
  if (Array.isArray(value)) {
    if (value.length > REQUEST_LIMITS.argumentItems)
      throw new Error('Generator argument arrays must have at most 100 items.')
    value.forEach((item) => checkArguments(item, depth + 1, '', allocation))
  } else if (value && typeof value === 'object') {
    for (const [name, item] of Object.entries(value)) {
      if (RESERVED_KEYS.has(name)) throw new Error('Reserved generator argument key.')
      if (
        ['length', 'count', 'paragraphCount', 'sentenceCount', 'wordCount'].includes(name) &&
        typeof item === 'number' &&
        (item < 0 || item > REQUEST_LIMITS.argumentSize)
      )
        throw new Error('Generator output lengths must be between 0 and 1000.')
      // Bounds inside length ranges also affect allocation size.
      if (key === 'length' && typeof item === 'number' && (item < 0 || item > REQUEST_LIMITS.argumentSize))
        throw new Error('Generator output lengths must be between 0 and 1000.')
      checkArguments(item, depth + 1, name, allocation)
    }
  }
}
