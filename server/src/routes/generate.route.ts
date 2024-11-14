import { GenerateBodyCSVRequest, GenerateBodyJSONRequest, GenerateBodySQLRequest, GenerateBodyTemplateRequest } from '../schema/generate.schema'
import { HTTPException } from 'hono/http-exception'
import { generateFakeData, generateFakeDataFromTemplate } from '../lib/fakeDataGenerator'
import { z, OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { createObjectCsvStringifier } from 'csv-writer'
import { generateSingleRowInsertStatements, generateMultiRowInsertStatement } from '../util'
import { formatToReadableError } from '../lib/errorSuggestions'

export const generate = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          errors: result.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
            readableMessage: formatToReadableError(e),
          })),
        },
        422,
      )
    }
  },
})

export const generateJSONRoute = createRoute({
  method: 'post',
  path: '/generate/json',
  summary: 'Generate JSON',
  description: 'Generate JSON data based on defined schemas.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: GenerateBodyJSONRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z
            .object({
              data: z.record(z.any()),
            })
            .openapi({
              type: 'object',
              example: {
                data: {
                  user: {
                    name: 'Quinn',
                    email: 'Luther15@hotmail.com',
                    address: {
                      street: '240 Mante Gateway',
                      city: 'Kamrenshire',
                      country: 'Canada',
                    },
                  },
                },
              },
            }),
        },
      },
      description: 'Generated JSON data.',
    },
  },
  tags: ['Generate Routes'],
})

generate.openapi(generateJSONRoute, (c) => {
  const { schema, count, locale } = c.req.valid('json')

  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }

  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale))
  return results.length === 1 ? c.json({ data: results[0] }) : c.json({ data: results })
})

export const generateCSVRoute = createRoute({
  method: 'post',
  path: '/generate/csv',
  summary: 'Generate CSV',
  description: 'Generate CSV file based on defined schemas.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: GenerateBodyCSVRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'text/plain': {
          schema: z.string().openapi({
            type: 'string',
            example: 'name,email\nAngilbe,Francine2@yahoo.fr',
          }),
        },
      },
      description: 'Generated CSV content.',
    },
  },
  tags: ['Generate Routes'],
})

generate.openapi(generateCSVRoute, (c) => {
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
})

export const generateSQLRoute = createRoute({
  method: 'post',
  path: '/generate/sql',
  summary: 'Generate SQL',
  description: 'Generate SQL statements based on defined schemas.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: GenerateBodySQLRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'text/sql': {
          schema: z.string().openapi({
            type: 'string',
            example: "INSERT INTO users (name, email) VALUES ('Quinn', 'Luther15@hotmail.com');",
          }),
        },
      },
      description: 'Generated SQL statement.',
    },
  },
  tags: ['Generate Routes'],
})

generate.openapi(generateSQLRoute, (c) => {
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
})

export const generateTemplateRoute = createRoute({
  method: 'post',
  path: '/generate/template',
  summary: 'Generate Data from Template',
  description: 'Generate mock data based on a custom template.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: GenerateBodyTemplateRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z
            .object({
              data: z.array(z.string()),
            })
            .openapi({
              type: 'object',
              example: {
                data: ['Hello, my name is John Doe and my email is john.doe@example.com.'],
              },
            }),
        },
      },
      description: 'Generated data based on the provided template.',
    },
  },
  tags: ['Generate Routes'],
})

generate.openapi(generateTemplateRoute, (c) => {
  const { template, count, locale = 'en' } = c.req.valid('json')

  if (!template) {
    throw new HTTPException(400, {
      message: 'Invalid template',
    })
  }
  const results = Array.from({ length: count ?? 1 }, () => generateFakeDataFromTemplate(template, locale))
  return results.length === 1 ? c.json({ data: [results[0]] }) : c.json({ data: results })
})
