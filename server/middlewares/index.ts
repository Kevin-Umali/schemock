import { OpenAPIHono } from '@hono/zod-openapi'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { rateLimiter } from 'hono-rate-limiter'
import { prettyJSON } from 'hono/pretty-json'

import { enhancedLogger } from './custom-logger'
import { extractClientIp } from '../utils/ip'
import { config } from '../config'
import { createCache } from './cache.middleware'

/**
 * Applies all global middlewares to the app
 * @param app - Hono app instance
 * @returns The app with middlewares applied
 */
export const applyMiddlewares = (app: OpenAPIHono): OpenAPIHono => {
  // Security headers
  app.use(secureHeaders())
  
  // Enhanced logging
  app.use(enhancedLogger({ level: 'debug' }))
  
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
  
  // Rate limiting
  app.use(
    rateLimiter({
      windowMs: config.rateLimit.windowMs,
      limit: config.rateLimit.limit,
      standardHeaders: config.rateLimit.standardHeaders,
      keyGenerator: (c) => extractClientIp(c),
    }),
  )
  
  // Pretty JSON responses
  app.use(prettyJSON())
  
  return app
}

// Export all middlewares
export { enhancedLogger } from './custom-logger'
export { createCache } from './cache.middleware'
