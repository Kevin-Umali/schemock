import { HTTPException } from 'hono/http-exception'
import { generateFakeData, generateFakeDataFromTemplate } from '../../lib/fake-data-generator'
import { createObjectCsvStringifier } from 'csv-writer'
import { generateMultiRowInsertStatement, generateSingleRowInsertStatements } from '../../lib/utils'
import type { HonoRouteHandler } from '../../lib/types'
import type { CSVRoute, JSONRoute, SQLRoute, TemplateRoute } from './generate.route'

export const jsonHandler: HonoRouteHandler<JSONRoute> = async (c) => {
  const { schema, count, locale } = c.req.valid('json')

  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }

  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale))
  return results.length === 1 ? c.json({ data: results[0] }) : c.json({ data: results })
}

export const csvHandler: HonoRouteHandler<CSVRoute> = async (c) => {
  const { schema, count, locale } = c.req.valid('json')
  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }
  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale))
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
  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale))
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
  const { template, count, locale = 'en' } = c.req.valid('json')

  if (!template) {
    throw new HTTPException(400, {
      message: 'Invalid template',
    })
  }
  const results = Array.from({ length: count ?? 1 }, () => generateFakeDataFromTemplate(template, locale))
  return results.length === 1 ? c.json({ data: [results[0]] }) : c.json({ data: results })
}
