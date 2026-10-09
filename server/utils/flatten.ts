export const flattenObject = (object: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(object).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key
      return value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        Object.keys(value).length
        ? Object.entries(flattenObject(value as Record<string, unknown>, path))
        : [[path, value]]
    }),
  )
}
// Spreadsheet applications interpret these prefixes as formulas even in quoted cells.
export const csvValue = (value: unknown): string => {
  const text =
    value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text
}
