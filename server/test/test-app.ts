import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { formatToReadableError } from '../utils/error-suggestion'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { config } from '../config'

/**
 * Creates a test version of the app without rate limiting and other middlewares
 * that might cause issues in the test environment
 */
export const createTestApp = () => {
  const app = new OpenAPIHono({
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

  // Apply only essential middlewares for testing
  app.use(secureHeaders())
  app.use(cors(config.cors))
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

  // Global error handler
  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }

    console.error('Unhandled error:', err)
    return c.json({ success: false, error: err.message }, 500)
  })

  return app
}
