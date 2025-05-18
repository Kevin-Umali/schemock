/**
 * Utility functions for formatting CSV data
 */

import { formatArray, flattenObject } from './objectFormatters'

/**
 * Escapes a value for CSV format
 * @param value - Value to escape
 * @returns Escaped value
 */
export const escapeCsvValue = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }
  
  const stringValue = String(value)
  
  // If the value contains commas, quotes, or newlines, wrap it in quotes
  if (/[",\n\r]/.test(stringValue)) {
    // Double up any quotes within the value
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Formats a row of data for CSV
 * @param row - Object containing column values
 * @param headers - Array of column headers
 * @returns Formatted CSV row
 */
export const formatCsvRow = (row: Record<string, any>, headers: string[]): string => {
  return headers.map(header => escapeCsvValue(row[header])).join(',')
}

/**
 * Formats an array of objects into CSV format
 * @param data - Array of objects to format
 * @param includeHeaders - Whether to include headers in the output
 * @returns Formatted CSV string
 */
export const formatCsv = (data: Record<string, any>[], includeHeaders: boolean = true): string => {
  if (data.length === 0) {
    return ''
  }
  
  // Get all unique headers from all objects
  const headers = Array.from(
    new Set(
      data.flatMap(obj => Object.keys(obj))
    )
  )
  
  // Create the header row if requested
  const headerRow = includeHeaders ? headers.map(escapeCsvValue).join(',') : ''
  
  // Format each data row
  const rows = data.map(row => formatCsvRow(row, headers))
  
  // Combine header and data rows
  return headerRow
    ? [headerRow, ...rows].join('\n')
    : rows.join('\n')
}

/**
 * Formats complex objects for CSV by flattening nested structures
 * @param data - Array of objects to format
 * @param flatten - Whether to flatten nested objects
 * @returns Formatted CSV string
 */
export const formatComplexCsv = (
  data: Record<string, any>[], 
  flatten: boolean = false
): string => {
  if (data.length === 0) {
    return ''
  }
  
  // Process the data based on whether flattening is requested
  const processedData = flatten
    ? data.map(item => flattenObject(item))
    : data.map(item => {
        // Convert any complex objects to string representations
        return Object.entries(item).reduce((acc, [key, value]) => {
          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              acc[key] = formatArray(value)
            } else {
              acc[key] = JSON.stringify(value)
            }
          } else {
            acc[key] = value
          }
          return acc
        }, {} as Record<string, any>)
      })
  
  return formatCsv(processedData)
}
