/**
 * Generates SQL INSERT statements for each record
 * @param results - Array of data objects to insert
 * @param tableName - Name of the table to insert into
 * @returns SQL string with INSERT statements
 */
export const generateSingleRowInsertStatements = (results: Record<string, any>[], tableName: string): string => {
  return results
    .map((record) => {
      const columns = Object.keys(record).join(', ')
      const values = Object.values(record)
        .map((value) => formatSqlValue(value))
        .join(', ')
      return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`
    })
    .join('\n')
}

/**
 * Generates a multi-row SQL INSERT statement
 * @param results - Array of data objects to insert
 * @param tableName - Name of the table to insert into
 * @returns SQL string with a multi-row INSERT statement
 */
export const generateMultiRowInsertStatement = (results: Record<string, any>[], tableName: string): string => {
  if (results.length === 0) {
    return ''
  }

  const columns = Object.keys(results[0]).join(', ')
  const values = results
    .map((record, index) => {
      const formattedValues = Object.values(record)
        .map((value) => formatSqlValue(value))
        .join(', ')
      return index === 0 ? `(${formattedValues})` : `\t(${formattedValues})`
    })
    .join(',\n')
  return `INSERT INTO ${tableName} (${columns}) VALUES ${values};`
}

/**
 * Formats a value for SQL insertion, adding quotes for strings
 * @param value - Value to format
 * @returns Formatted value
 */
const formatSqlValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'NULL'
  }

  if (typeof value === 'string') {
    // Escape single quotes in strings
    return `'${value.replace(/'/g, "''")}'`
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0'
  }

  if (value instanceof Date) {
    return `'${value.toISOString()}'`
  }

  if (typeof value === 'object') {
    // Convert objects to JSON strings
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`
  }

  return String(value)
}
