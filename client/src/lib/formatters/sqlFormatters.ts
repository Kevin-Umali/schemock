/**
 * Utility functions for formatting SQL values
 */

/**
 * Formats a value for SQL insertion, adding quotes for strings
 * @param value - Value to format
 * @returns Formatted value
 */
export const formatSqlValue = (value: any): string => {
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

/**
 * Formats column names for SQL statements
 * @param columnName - Column name to format
 * @returns Formatted column name
 */
export const formatSqlColumnName = (columnName: string): string => {
  // Replace any characters that aren't valid in SQL column names
  // with underscores, and convert to lowercase
  return columnName
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .toLowerCase()
}

/**
 * Creates a SQL CREATE TABLE statement
 * @param tableName - Name of the table
 * @param columns - Column names
 * @returns SQL CREATE TABLE statement
 */
export const createSqlTableStatement = (tableName: string, columns: string[]): string => {
  const formattedColumns = columns.map(col => `${formatSqlColumnName(col)} TEXT`).join(',\n  ')
  
  return `CREATE TABLE ${tableName} (\n  ${formattedColumns}\n);`
}

/**
 * Creates a SQL INSERT statement for a single row
 * @param tableName - Name of the table
 * @param data - Object containing column names and values
 * @returns SQL INSERT statement
 */
export const createSqlInsertStatement = (
  tableName: string, 
  data: Record<string, any>
): string => {
  const columns = Object.keys(data).map(formatSqlColumnName)
  const values = Object.values(data).map(formatSqlValue)
  
  return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`
}

/**
 * Creates a SQL multi-row INSERT statement
 * @param tableName - Name of the table
 * @param dataArray - Array of objects containing column names and values
 * @returns SQL multi-row INSERT statement
 */
export const createSqlMultiRowInsertStatement = (
  tableName: string, 
  dataArray: Record<string, any>[]
): string => {
  if (dataArray.length === 0) {
    return ''
  }
  
  // Use the first row to determine columns
  const firstRow = dataArray[0]
  const columns = Object.keys(firstRow).map(formatSqlColumnName)
  
  // Format each row's values
  const valueRows = dataArray.map(row => {
    const rowValues = columns.map(col => {
      const originalKey = Object.keys(firstRow).find(
        key => formatSqlColumnName(key) === col
      )
      return formatSqlValue(row[originalKey || col])
    })
    return `(${rowValues.join(', ')})`
  })
  
  return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n${valueRows.join(',\n')};`
}
