/**
 * Sorts an array of objects by a nested field path
 * @param data - Array of objects to sort
 * @param sortField - Dot-notation path to the field to sort by (e.g., 'user.name')
 * @param sortOrder - Sort direction ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortNestedData = <T extends Record<string, any>>(
  data: T[], 
  sortField: string, 
  sortOrder: string
): T[] => {
  // Split the field path into segments
  const fields = sortField.split('.')
  
  return [...data].sort((a: T, b: T) => {
    let aValue: any = a
    let bValue: any = b

    // Navigate through the nested properties
    for (const field of fields) {
      if (aValue && typeof aValue === 'object') {
        aValue = aValue[field]
      } else {
        aValue = undefined
        break
      }
      
      if (bValue && typeof bValue === 'object') {
        bValue = bValue[field]
      } else {
        bValue = undefined
        break
      }
    }

    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return sortOrder === 'asc' ? -1 : 1
    if (bValue === undefined) return sortOrder === 'asc' ? 1 : -1

    // Compare values based on their types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime()
    }
    
    // Convert to strings for comparison if types don't match
    const strA = String(aValue)
    const strB = String(bValue)
    
    return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
  })
}
