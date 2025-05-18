import { z } from '@hono/zod-openapi'
import { Locales, FakerMethods } from '../constant'
import type { ZodType } from 'zod'

/**
 * Schema for count parameter with validation
 */
export const CountSchema = z.number().int().min(1).max(100).default(1).openapi({
  type: 'number',
  description: 'Number of items to generate (max 100)',
  example: 5,
})

/**
 * Schema for locale parameter with validation
 */
export const LocaleSchema = Locales.optional().default('en').openapi({
  type: 'string',
  description: 'Locale to use for generating data',
  example: 'en',
})

/**
 * Schema for table name parameter with validation
 */
export const TableNameSchema = z.string().min(1).max(64).regex(/^\w+$/).openapi({
  type: 'string',
  description: 'Name of the table for SQL generation',
  example: 'users',
})

/**
 * Schema for multi-row insert parameter
 */
export const MultiRowInsertSchema = z.boolean().default(false).openapi({
  type: 'boolean',
  description: 'Whether to generate a multi-row insert statement',
  example: false,
})

/**
 * Schema for template parameter with validation
 */
export const TemplateSchema = z.string().min(1).max(10000).openapi({
  type: 'string',
  description: 'Template string with {{faker.method}} placeholders',
  example: 'Hello, my name is {{person.firstName}} {{person.lastName}}!',
})

/**
 * Base schema for simple key-value pairs
 */
export const BaseSchema: ZodType<Record<string, string>> = z.record(z.string().min(1), FakerMethods.openapi({ type: 'string' })).openapi({
  type: 'object',
  description: 'Simple key-value schema for generating data',
  example: {
    name: 'person.firstName',
    email: 'internet.email',
  },
})

/**
 * Schema for array items in nested schema
 */
export const ArrayItemsSchema = z.lazy(() =>
  z
    .object({
      items: z
        .lazy(() => NestedBaseSchema)
        .optional()
        .openapi({
          type: 'object',
          description: 'Schema for array items',
        }),
      count: CountSchema.openapi({
        description: 'Number of array items to generate',
      }),
    })
    .openapi({
      type: 'object',
      description: 'Array configuration',
    }),
)

/**
 * Nested schema that supports complex hierarchical structures
 */
export const NestedBaseSchema: ZodType<Record<string, unknown>> = z.lazy(() =>
  z
    .record(
      z.string().min(1),
      z.union([
        // Faker method string
        FakerMethods.openapi({
          type: 'string',
          description: 'Faker method to generate data',
        }),

        // Primitive types
        z.string().optional().openapi({ type: 'string' }),
        z.number().optional().openapi({ type: 'number' }),
        z.boolean().optional().openapi({ type: 'boolean' }),
        z.date().optional().openapi({ type: 'string', format: 'date-time' }),

        // Nested object
        z
          .lazy(() => NestedBaseSchema)
          .optional()
          .openapi({
            type: 'object',
            description: 'Nested object schema',
          }),

        // Array configuration
        ArrayItemsSchema,
      ]),
    )
    .openapi({
      type: 'object',
      description: 'Complex nested schema for generating hierarchical data',
    }),
)

/**
 * Common fields used across multiple schemas
 */
export const commonFields = {
  count: CountSchema,
  locale: LocaleSchema,
}

/**
 * Type definitions for schema structures
 */
export type Count = z.infer<typeof CountSchema>
export type Locale = z.infer<typeof LocaleSchema>
export type TableName = z.infer<typeof TableNameSchema>
export type Template = z.infer<typeof TemplateSchema>
export type NestedSchema = z.infer<typeof NestedBaseSchema>
