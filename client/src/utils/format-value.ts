export const displayValue = (value: unknown): string =>
  value === undefined ? 'undefined' : typeof value === 'object' ? JSON.stringify(value) : String(value)
