import { z } from '@hono/zod-openapi'
import { commonFields, NestedBaseSchema } from './base.schema'

/**
 * Schema for the request body of the pagination endpoint
 */
export const MockBodyPaginationRequest = z
  .object({
    schema: NestedBaseSchema,
    ...commonFields,
  })
  .openapi({
    type: 'object',
    description: 'Schema for generating paginated mock data',
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
      count: 20,
      locale: 'en',
    },
  })

/**
 * Schema for pagination query parameters
 */
export const MockQueryPaginationParams = z
  .object({
    page: z.string().min(1).regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional().default('1').openapi({
      type: 'string',
      description: 'Page number (starts at 1)',
      example: '1',
    }),
    limit: z.string().min(1).regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('10').openapi({
      type: 'string',
      description: 'Number of items per page (max 100)',
      example: '10',
    }),
    sort: z
      .string()
      .regex(/^[\w.]+:(asc|desc)$/)
      .optional()
      .openapi({
        type: 'string',
        description: 'Sort field and direction in format field:direction',
        example: 'name:asc',
      }),
  })
  .openapi({
    type: 'object',
    description: 'Query parameters for pagination control',
  })

export type MockBodyPagination = z.infer<typeof MockBodyPaginationRequest>
export type MockQueryPagination = z.infer<typeof MockQueryPaginationParams>
