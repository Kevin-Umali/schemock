import { OpenAPIHono } from '@hono/zod-openapi'
import { formatToReadableError } from './error-suggestion'
import { secureHeaders } from 'hono/secure-headers'

import { cors } from 'hono/cors'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { rateLimiter } from 'hono-rate-limiter'
import { extractClientIp } from './utils'
import { prettyJSON } from 'hono/pretty-json'
import { enhancedLogger } from '../middlewares/custom-logger'

const createRouter = () => {
  return new OpenAPIHono({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: false,
            errors: result.error.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
              readableMessage: formatToReadableError(e),
            })),
          },
          422,
        )
      }
    },
  })
}

const createApp = () => {
  const app = createRouter().basePath('/api/v1')

  app.use(secureHeaders())
  app.use(enhancedLogger({ level: 'debug' }))
  app.use(
    cors({
      origin: '*',
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    }),
  )
  app.use(
    timeout(
      60000,
      () =>
        new HTTPException(408, {
          message: 'Request Timeout after waiting 60 seconds. Please try again later.',
        }),
    ),
  )
  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      keyGenerator: (c) => extractClientIp(c),
    }),
  )
  app.use(prettyJSON())

  app.notFound((c) => {
    return c.json(
      {
        message: 'Not Found - Check the documentation for more information.',
        swagger: '/api/v1/ui',
      },
      404,
    )
  })
  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }

    return c.json({ sucess: false, error: err.message }, 500)
  })

  return app
}

export { createApp, createRouter }
