import { z } from '@hono/zod-openapi'

export const HelperPathParameter = z.object({
  name: z.enum(['faker', 'locale']).openapi({
    param: {
      name: 'name',
      in: 'path',
      required: true,
    },
    description: 'The name of the enum category to fetch options for.',
    example: 'faker',
  }),
})

export type HelperPath = z.infer<typeof HelperPathParameter>
