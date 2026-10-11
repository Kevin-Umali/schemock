import { JSON_CONTENT_TYPE } from '../constant/security'
import { createMiddleware } from 'hono/factory'
import { rateLimiter } from 'hono-rate-limiter'
import { config } from '../config'
import { extractClientIp } from '../utils/ip'
import { MOCK_LIMITS } from '../../shared/constants/mock'
import { decodeMockToken } from '../utils/decode-mock-token'

const limiter = (limit: number) =>
  rateLimiter({
    windowMs: config.rateLimit.windowMs,
    limit,
    standardHeaders: true,
    keyGenerator: extractClientIp,
    handler: (c) =>
      c.json(
        {
          message: `Generation limit reached. Try again in ${Number(c.res.headers.get('Retry-After')) || 60} seconds.`,
          retryAfter: Number(c.res.headers.get('Retry-After')) || 60,
        },
        429,
      ),
  })
const writes = limiter(config.rateLimit.limit)
const bulk = limiter(config.rateLimit.bulkLimit)

/** Metadata reads and preflight requests do not consume generation quotas. */
export const generationRateLimit = createMiddleware(async (c, next) => {
  const isEncodedMock = /^\/api\/v1\/mock\/run\/[^/]+/.test(c.req.path)
  if (c.req.method !== 'POST' && !isEncodedMock) return next()
  if (c.req.method === 'OPTIONS') return next()
  c.header('Cache-Control', 'no-store')
  return writes(c, next)
})

export const bulkRateLimit = createMiddleware(async (c, next) => {
  const encodedMock = /^\/api\/v1\/mock\/run\/([^/]+)/.exec(c.req.path)
  if (encodedMock) {
    try {
      const raw = await decodeMockToken(encodedMock[1])
      if (raw.length <= MOCK_LIMITS.decodedBytes) {
        const def = JSON.parse(raw.toString('utf8')) as {
          entries?: Array<{
            count?: number
            response?: { kind?: string; count?: number }
            scenarios?: Array<{ response?: { kind?: string; count?: number } }>
          }>
        }
        const bulkCount = (def.entries ?? []).reduce((total, entry) => {
          const generated = (response?: { kind?: string; count?: number }) =>
            response?.kind === 'generated' ? (response.count ?? 0) : 0
          return (
            total +
            (entry.count ?? 0) +
            generated(entry.response) +
            (entry.scenarios ?? []).reduce((sum, scenario) => sum + generated(scenario.response), 0)
          )
        }, 0)
        return bulkCount > 25 ? bulk(c, next) : next()
      }
    } catch {
      return next()
    }
  }
  if (c.req.method !== 'POST' || !JSON_CONTENT_TYPE.test(c.req.header('Content-Type') ?? '')) return next()
  const body = await c.req.json<{ count?: number }>()
  const count = c.req.path.endsWith('/mock/pagination')
    ? Math.min(body.count ?? 1, Number(c.req.query('limit') ?? 10))
    : (body.count ?? 1)
  return count > 25 ? bulk(c, next) : next()
})
