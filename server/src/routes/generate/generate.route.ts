import { createRoute, z } from '@hono/zod-openapi'

import { GenerateBodyJSONRequest, GenerateBodyCSVRequest, GenerateBodySQLRequest, GenerateBodyTemplateRequest } from '../../schema/generate.schema'

const tags = ['Generate Routes']

export const jsonRoute = createRoute({
  method: 'post',
  path: '/generate/json',
  summary: 'Generate JSON Data',
  description: 'Create mock JSON data based on your schema.',
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
      description: 'Mock JSON data.',
    },
  },
  tags,
})

export const csvRoute = createRoute({
  method: 'post',
  path: '/generate/csv',
  summary: 'Generate CSV File',
  description: 'Create a CSV file based on your schema.',
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
      description: 'Mock CSV data.',
    },
  },
  tags,
})

export const sqlRoute = createRoute({
  method: 'post',
  path: '/generate/sql',
  summary: 'Generate SQL Statements',
  description: 'Create SQL insert statements based on your schema.',
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
  tags,
})

export const templateRoute = createRoute({
  method: 'post',
  path: '/generate/template',
  summary: 'Generate Template-Based Data',
  description: 'Create mock data using a custom template.',
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
              example: {
                data: ['Hello, my name is John Doe and my email is john.doe@example.com.'],
              },
            }),
        },
      },
      description: 'Mock data from the template.',
    },
  },
  tags,
})

export type JSONRoute = typeof jsonRoute
export type CSVRoute = typeof csvRoute
export type SQLRoute = typeof sqlRoute
export type TemplateRoute = typeof templateRoute
