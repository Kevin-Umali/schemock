import { createObjectCsvStringifier } from 'csv-writer'
import { generateFakeRecords, generateTemplates } from '../../services/faker.service'
import { flattenObject, csvValue } from '../../utils/flatten'
import { generateMultiRowInsertStatement, generateSingleRowInsertStatements } from '../../utils/sql'
import type { HonoRouteHandler } from '../../lib/types'
import type { CSVRoute, JSONRoute, SQLRoute, TemplateRoute } from './generate.route'
const generateRecords = (schema: Record<string, unknown>, count: number, locale: string, flatten = false) => {
  const records = generateFakeRecords(schema, count, locale)
  return flatten ? records.map((record) => flattenObject(record)) : records
}
export const jsonHandler: HonoRouteHandler<JSONRoute> = async (c) => {
  const { schema, count, locale } = c.req.valid('json')
  const records = generateRecords(schema, count, locale)
  return c.json({ data: records.length === 1 ? records[0] : records })
}
export const csvHandler: HonoRouteHandler<CSVRoute> = async (c) => {
  const { schema, count, locale } = c.req.valid('json')
  const records = generateRecords(schema, count, locale, c.req.header('X-Flatten-Objects') === 'true')
  const keys = [...new Set(records.flatMap((record) => Object.keys(record)))]
  const stringifier = createObjectCsvStringifier({ header: keys.map((key) => ({ id: key, title: csvValue(key) })) })
  const csv =
    stringifier.getHeaderString() +
    stringifier.stringifyRecords(
      records.map((record) => Object.fromEntries(Object.entries(record).map(([key, value]) => [key, csvValue(value)]))),
    )
  return c.text(csv, 200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="fake_data.csv"',
  })
}
export const sqlHandler: HonoRouteHandler<SQLRoute> = async (c) => {
  const { schema, count, locale, tableName, multiRowInsert } = c.req.valid('json')
  const records = generateRecords(schema, count, locale, c.req.header('X-Flatten-Objects') === 'true')
  const sql = multiRowInsert
    ? generateMultiRowInsertStatement(records, tableName)
    : generateSingleRowInsertStatements(records, tableName)
  return c.text(sql, 200, {
    'Content-Type': 'text/sql; charset=utf-8',
    'Content-Disposition': 'attachment; filename="fake_data.sql"',
  })
}
export const templateHandler: HonoRouteHandler<TemplateRoute> = async (c) => {
  const { template, count, locale } = c.req.valid('json')
  const formatObjects = c.req.header('X-Format-Objects') !== 'false'
  const data = generateTemplates(template, count, locale, formatObjects)
  return c.json({ data })
}
