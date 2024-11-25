import { HTTPException } from 'hono/http-exception'
import { generateFakeData } from '../../lib/fake-data-generator'
import type { HonoRouteHandler } from '../../lib/types'
import { sortNestedData } from '../../lib/utils'
import type { PaginationRoute } from './mock.route'

export const paginationHandler: HonoRouteHandler<PaginationRoute> = async (c) => {
  const { schema, count, locale } = c.req.valid('json')
  const { page, limit, sort } = c.req.valid('query')

  if (!schema) {
    throw new HTTPException(400, {
      message: 'Invalid schema',
    })
  }

  const pageInt = parseInt(page, 10)
  const limitInt = parseInt(limit, 10)

  const startIndex = (pageInt - 1) * limitInt
  const endIndex = Math.min(startIndex + limitInt, count)

  if (startIndex >= count || startIndex < 0) {
    return c.json({ data: [], page: pageInt, limit: limitInt, total: count })
  }

  const actualLimit = endIndex - startIndex

  let data = Array.from({ length: actualLimit }, () => generateFakeData(schema, locale))

  if (sort) {
    const [sortField, sortOrder] = sort.split(':')
    data = sortNestedData(data, sortField, sortOrder)
  }

  return c.json({ data, page: pageInt, limit: limitInt, total: count })
}
