import { createRoute, z } from '@hono/zod-openapi'
import { MockQueryPaginationParams, MockBodyPaginationRequest } from '../../schema/mock.schema'
import { withOptionalBearerSecurity } from '../../utils/openapi-security'
import { API_KEY_OPENAPI_DESCRIPTION } from '../../constant/api-auth'
const tags = ['Mock API']
export const paginationRoute = withOptionalBearerSecurity(
  createRoute({
    method: 'post',
    path: '/mock/pagination',
    summary: 'Generate Paginated Data',
    description: `Create mock paginated data for API testing. ${API_KEY_OPENAPI_DESCRIPTION}`,
    request: {
      query: MockQueryPaginationParams,
      body: {
        content: {
          'application/json': {
            schema: MockBodyPaginationRequest,
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z
              .object({
                data: z.array(z.any()),
                page: z.number(),
                limit: z.number(),
                total: z.number(),
              })
              .openapi({
                example: {
                  data: [
                    {
                      name: 'John',
                      email: 'oDpO7@example.test',
                    },
                    {
                      name: 'Jane',
                      email: '12pO7@example.test',
                    },
                  ],
                  page: 1,
                  limit: 10,
                  total: 2,
                },
              }),
          },
        },
        description: 'Mock paginated data.',
      },
    },
    tags,
  }),
)
export type PaginationRoute = typeof paginationRoute
