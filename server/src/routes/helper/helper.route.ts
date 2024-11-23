import { createRoute, z } from '@hono/zod-openapi'
import { HelperPathParameter } from '../../schema/helper.schema'

const tags = ['Helper Routes']

export const enumRoute = createRoute({
  method: 'get',
  path: '/helper/enum/{name}',
  summary: 'Get Enum Options',
  description: 'Retrieve available options for a given enum name.',
  request: {
    params: HelperPathParameter,
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
                data: ['datatype.number', 'datatype.float', 'datatype.datetime'],
              },
            }),
        },
      },
      description: 'Available enum options for the specified name.',
    },
  },
  tags,
})

export type EnumRoute = typeof enumRoute
