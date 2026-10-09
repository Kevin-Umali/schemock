const nestedValue = (record: unknown, path: string[]): unknown => {
  return path.reduce<unknown>(
    (value, key) =>
      value !== null && typeof value === 'object' && Object.hasOwn(value, key)
        ? (value as Record<string, unknown>)[key]
        : undefined,
    record,
  )
}
/** Sort a copy of the records, following only their own nested properties. */
export const sortNestedData = <T extends Record<string, unknown>>(
  data: T[],
  sortField: string,
  sortOrder: string,
): T[] => {
  const path = sortField.split('.')
  const direction = sortOrder === 'asc' ? 1 : -1
  return [...data].sort((a, b) => {
    const left = nestedValue(a, path)
    const right = nestedValue(b, path)
    if (left === undefined && right === undefined) return 0
    if (left === undefined) return -direction
    if (right === undefined) return direction
    if (typeof left === 'number' && typeof right === 'number') return direction * (left - right)
    if (left instanceof Date && right instanceof Date) return direction * (left.getTime() - right.getTime())
    return direction * String(left).localeCompare(String(right))
  })
}
