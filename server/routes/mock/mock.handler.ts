import { HTTPException } from 'hono/http-exception'
import { generateFakeData } from '../../services/faker.service'
import type { HonoRouteHandler } from '../../lib/types'
import { sortNestedData } from '../../utils/sort'
import type { PaginationRoute } from './mock.route'

/**
 * Handler for the pagination endpoint
 * Generates paginated mock data based on the provided schema
 */
export const paginationHandler: HonoRouteHandler<PaginationRoute> = async (c) => {
  // Get validated request data
  const { schema, count, locale } = c.req.valid('json')
  const { page, limit, sort } = c.req.valid('query')

  // Validate schema
  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }

  // Calculate pagination indices
  const pageNumber = typeof page === 'number' ? page : 1
  const limitNumber = typeof limit === 'number' ? limit : 10

  const startIndex = (pageNumber - 1) * limitNumber
  const endIndex = Math.min(startIndex + limitNumber, count)

  // Return empty data if page is out of range
  if (startIndex >= count || startIndex < 0) {
    return c.json({
      data: [],
      page: pageNumber,
      limit: limitNumber,
      total: count,
    })
  }

  // Calculate actual number of items to generate
  const actualLimit = endIndex - startIndex

  // Generate mock data
  let data = Array.from({ length: actualLimit }, () => generateFakeData(schema as any, locale))

  // Apply sorting if requested
  if (sort) {
    const [sortField, sortOrder] = sort.split(':')
    data = sortNestedData(data, sortField, sortOrder)
  }

  // Return paginated response
  return c.json({
    data,
    page: pageNumber,
    limit: limitNumber,
    total: count,
  })
}
