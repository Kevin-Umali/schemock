import { createRoute, z } from '@hono/zod-openapi'
import {
  GenerateBodyJSONRequest,
  GenerateBodyCSVRequest,
  GenerateBodySQLRequest,
  GenerateBodyTemplateRequest,
} from '../../schema/generate.schema'
import { withOptionalBearerSecurity } from '../../utils/openapi-security'
import { API_KEY_OPENAPI_DESCRIPTION } from '../../constant/api-auth'
const tags = ['Generators']
export const jsonRoute = withOptionalBearerSecurity(
  createRoute({
    method: 'post',
    path: '/generate/json',
    summary: 'Generate JSON Data',
    description: `Create mock JSON data based on your schema. ${API_KEY_OPENAPI_DESCRIPTION}`,
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
                data: z.union([z.record(z.string(), z.any()), z.array(z.record(z.string(), z.any()))]),
              })
              .openapi({
                example: {
                  data: {
                    user: {
                      name: 'Quinn',
                      email: 'quinn@example.test',
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
  }),
)
export const csvRoute = withOptionalBearerSecurity(
  createRoute({
    method: 'post',
    path: '/generate/csv',
    summary: 'Generate CSV File',
    description: `Create a CSV file based on your schema. ${API_KEY_OPENAPI_DESCRIPTION}`,
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
              example: 'name,email\nAngilbe,maya@example.test',
            }),
          },
        },
        description: 'Mock CSV data.',
      },
    },
    tags,
  }),
)
export const sqlRoute = withOptionalBearerSecurity(
  createRoute({
    method: 'post',
    path: '/generate/sql',
    summary: 'Generate SQL Statements',
    description: `Create SQL insert statements based on your schema. ${API_KEY_OPENAPI_DESCRIPTION}`,
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
              example: "INSERT INTO users (name, email) VALUES ('Quinn', 'quinn@example.test');",
            }),
          },
        },
        description: 'Generated SQL statement.',
      },
    },
    tags,
  }),
)
export const templateRoute = withOptionalBearerSecurity(
  createRoute({
    method: 'post',
    path: '/generate/template',
    summary: 'Generate Template-Based Data',
    description: `Create mock data using a custom template. ${API_KEY_OPENAPI_DESCRIPTION}`,
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
                  data: ['Hello, my name is John Doe and my email is john.doe@example.test.'],
                },
              }),
          },
        },
        description: 'Mock data from the template.',
      },
    },
    tags,
  }),
)
export type JSONRoute = typeof jsonRoute
export type CSVRoute = typeof csvRoute
export type SQLRoute = typeof sqlRoute
export type TemplateRoute = typeof templateRoute
