import { z } from '@hono/zod-openapi'
import { NestedBaseSchema, BaseSchema, commonFields, TableNameSchema, MultiRowInsertSchema, TemplateSchema, CountSchema, LocaleSchema } from './base.schema'

/**
 * Schema for generating JSON data with complex nested structure
 */
export const GenerateBodyJSONRequest = z
  .object({
    schema: NestedBaseSchema,
    ...commonFields,
  })
  .openapi({
    type: 'object',
    description: 'Schema for generating complex nested JSON data',
    example: {
      schema: {
        user: {
          name: 'person.firstName',
          email: 'internet.email',
          address: {
            street: 'location.streetAddress',
            city: 'location.city',
            country: 'location.country',
          },
        },
      },
      count: 1,
      locale: 'en',
    },
  })

/**
 * Schema for generating CSV data with flat structure
 */
export const GenerateBodyCSVRequest = z
  .object({
    schema: BaseSchema,
    ...commonFields,
  })
  .openapi({
    type: 'object',
    description: 'Schema for generating CSV data with flat structure',
    example: {
      schema: {
        name: 'person.firstName',
        email: 'internet.email',
      },
      count: 10,
      locale: 'en',
    },
  })

/**
 * Schema for generating SQL insert statements
 */
export const GenerateBodySQLRequest = z
  .object({
    schema: BaseSchema,
    ...commonFields,
    tableName: TableNameSchema,
    multiRowInsert: MultiRowInsertSchema,
  })
  .openapi({
    type: 'object',
    description: 'Schema for generating SQL insert statements',
    example: {
      schema: {
        name: 'person.firstName',
        email: 'internet.email',
      },
      count: 10,
      locale: 'en',
      tableName: 'users',
      multiRowInsert: true,
    },
  })

/**
 * Schema for generating data from a template string
 */
export const GenerateBodyTemplateRequest = z
  .object({
    template: TemplateSchema,
    count: CountSchema,
    locale: LocaleSchema,
  })
  .openapi({
    type: 'object',
    description: 'Schema for generating data from a template string with faker placeholders',
    example: {
      template: 'Hello, my name is {{person.firstName}} {{person.lastName}} and my email is {{internet.email}}.',
      count: 1,
      locale: 'en',
    },
  })

export type GenerateBodyJSON = z.infer<typeof GenerateBodyJSONRequest>
export type GenerateBodyCSV = z.infer<typeof GenerateBodyCSVRequest>
export type GenerateBodySQL = z.infer<typeof GenerateBodySQLRequest>
export type GenerateBodyTemplate = z.infer<typeof GenerateBodyTemplateRequest>
export type GenerateLocale = GenerateBodyJSON['locale']
