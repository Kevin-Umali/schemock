import { HTTPException } from 'hono/http-exception'
import { createObjectCsvStringifier } from 'csv-writer'
import { generateFakeData, generateFakeDataFromTemplate } from '../../services/faker.service'
import { generateMultiRowInsertStatement, generateSingleRowInsertStatements } from '../../utils/sql'
import type { HonoRouteHandler } from '../../lib/types'
import type { CSVRoute, JSONRoute, SQLRoute, TemplateRoute } from './generate.route'

export const jsonHandler: HonoRouteHandler<JSONRoute> = async (c) => {
  const { schema, count, locale } = c.req.valid('json')

  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }

  // Cast schema to GenerateSchema type as it's already validated by Zod
  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema as any, locale))
  return results.length === 1 ? c.json({ data: results[0] }) : c.json({ data: results })
}

export const csvHandler: HonoRouteHandler<CSVRoute> = async (c) => {
  const { schema, count, locale } = c.req.valid('json')
  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }
  // Cast schema to GenerateSchema type as it's already validated by Zod
  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema as any, locale))
  const csvStringifier = createObjectCsvStringifier({
    header: Object.keys(results[0]).map((key) => ({ id: key, title: key })),
  })

  const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(results)

  return c.text(csvContent, 200, {
    'Content-Length': Buffer.byteLength(csvContent).toString(),
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="fake_data.csv"',
  })
}

export const sqlHandler: HonoRouteHandler<SQLRoute> = async (c) => {
  const { schema, count, locale, tableName, multiRowInsert } = c.req.valid('json')
  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }
  // Cast schema to GenerateSchema type as it's already validated by Zod
  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema as any, locale))
  let insertStatements = ''
  if (multiRowInsert) {
    insertStatements = generateMultiRowInsertStatement(results, tableName)
  } else {
    insertStatements = generateSingleRowInsertStatements(results, tableName)
  }

  return c.text(insertStatements, 200, {
    'Content-Length': Buffer.byteLength(insertStatements).toString(),
    'Content-Type': 'text/sql; charset=utf-8',
    'Content-Disposition': 'attachment; filename="fake_data.sql"',
  })
}

export const templateHandler: HonoRouteHandler<TemplateRoute> = async (c) => {
  try {
    const { template, count, locale = 'en' } = c.req.valid('json')

    if (!template) {
      throw new HTTPException(400, {
        message: 'Invalid template',
      })
    }

    // Validate count
    if (count && (typeof count !== 'number' || count < 1 || count > 100)) {
      throw new HTTPException(400, {
        message: 'Count must be a number between 1 and 100',
      })
    }

    // Validate locale
    if (locale && typeof locale !== 'string') {
      throw new HTTPException(400, {
        message: 'Locale must be a valid string',
      })
    }

    // Check if the request wants raw JSON output (for programmatic use)
    const formatObjects = c.req.header('X-Format-Objects') !== 'false'

    // Generate results with error handling for each item
    const results = Array.from({ length: count ?? 1 }, () => {
      try {
        return generateFakeDataFromTemplate(template, locale, formatObjects)
      } catch (error) {
        console.error('Error generating template data:', error)
        return `Error generating data: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    })

    // Check if all results are error messages
    const allErrors = results.every((result) => result.startsWith('Error generating data:'))
    if (allErrors) {
      throw new HTTPException(500, {
        message: 'Failed to generate any valid data from template',
      })
    }

    return results.length === 1 ? c.json({ data: [results[0]] }) : c.json({ data: results })
  } catch (error) {
    // Handle errors that weren't caught by the global error handler
    if (error instanceof HTTPException) {
      throw error
    }

    console.error('Unhandled error in template handler:', error)
    throw new HTTPException(500, {
      message: `Template generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  }
}
