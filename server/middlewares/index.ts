import { JSON_CONTENT_TYPE } from '../constant/security'
import { OpenAPIHono } from '@hono/zod-openapi'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { generationRateLimit, bulkRateLimit } from './rate-limit.middleware'
import { prettyJSON } from 'hono/pretty-json'
import { bodyLimit } from 'hono/body-limit'
import { assertSchemaLimits } from '../services/schema-limits'
import { enhancedLogger } from './custom-logger'
import { REQUEST_LIMITS } from '../constant/security'
import { config } from '../config'
import { apiKeyAuth } from './api-key.middleware'
/**
 * Applies all global middlewares to the app
 * @param app - Hono app instance
 * @returns The app with middlewares applied
 */
export const applyMiddlewares = (app: OpenAPIHono): OpenAPIHono => {
  // Security headers
  app.use(secureHeaders({ referrerPolicy: 'no-referrer', xFrameOptions: 'DENY' }))
  app.use('*', async (c, next) => {
    const documentation = c.req.path === '/api/v1/ui'
    c.header(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        documentation ? "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net" : "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        documentation ? "connect-src 'self' https://cdn.jsdelivr.net" : "connect-src 'self'",
      ].join('; '),
    )
    await next()
  })
  // Enhanced logging
  app.use(enhancedLogger({ level: 'info', enabled: process.env.NODE_ENV !== 'test' }))
  // CORS
  app.use(cors(config.cors))
  // Request timeout
  app.use(
    timeout(
      config.timeout,
      () =>
        new HTTPException(408, {
          message: `Request Timeout after waiting ${config.timeout / 1000} seconds. Please try again later.`,
        }),
    ),
  )
  // Authenticate protected generation requests before charging write quotas.
  app.use('/api/*', apiKeyAuth)
  app.use('/api/*', generationRateLimit)
  app.use(
    '/api/*',
    bodyLimit({
      maxSize: REQUEST_LIMITS.bodyBytes,
      onError: (c) => c.json({ message: 'Request body exceeds the 64 KB limit.' }, 413),
    }),
  )
  // Bound raw schemas before recursive Zod validation and generation.
  app.use('/api/*', async (c, next) => {
    if (c.req.method === 'POST' && JSON_CONTENT_TYPE.test(c.req.header('Content-Type') ?? '')) {
      let body: unknown
      try {
        body = await c.req.json()
      } catch {
        return c.json({ message: 'Invalid JSON request body.' }, 400)
      }
      if (body && typeof body === 'object' && 'schema' in body) {
        const request = body as {
          schema: unknown
          count?: unknown
        }
        let count =
          typeof request.count === 'number' &&
          Number.isInteger(request.count) &&
          request.count >= 1 &&
          request.count <= 100
            ? request.count
            : 1
        if (c.req.path === '/api/v1/mock/pagination') {
          const limit = Number(c.req.query('limit') ?? 10)
          count = Math.min(count, Number.isInteger(limit) && limit >= 1 && limit <= 100 ? limit : 10)
        }
        assertSchemaLimits(request.schema, count)
      }
    }
    await next()
  })
  app.use('/api/*', bulkRateLimit)
  // Pretty JSON responses
  app.use(prettyJSON())
  return app
}
// Export all middlewares
export { enhancedLogger } from './custom-logger'
export { createCache } from './cache.middleware'
