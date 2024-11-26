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

export const fakerMethodRoute = createRoute({
  method: 'get',
  path: '/helper/faker',
  summary: 'Get Faker Method Options',
  description: 'Retrieve available options for a given faker method.',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z
            .object({
              data: z.array(
                z.object({
                  category: z.string(),
                  description: z.string(),
                  items: z.array(
                    z.object({
                      method: z.string(),
                      description: z.string(),
                      parameters: z.string(),
                      example: z.string(),
                    }),
                  ),
                }),
              ),
            })
            .openapi({
              type: 'object',
              example: {
                data: [
                  {
                    category: 'address',
                    description: 'Module to generate addresses and locations.',
                    items: [
                      {
                        method: 'location.streetAddress',
                        description: 'Generates a random localized street address.',
                        parameters: `{
                          useFullAddress?: boolean;
                        }`,
                        example: "'0917 O'Conner Estates'",
                      },
                    ],
                  },
                ],
              },
            }),
        },
      },
      description: 'Available faker method options for the specified name.',
    },
  },
  tags,
})

export type EnumRoute = typeof enumRoute
export type FakerMethodRoute = typeof fakerMethodRoute
