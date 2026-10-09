import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { formatToReadableError } from '../utils/error-suggestion'
import { applyMiddlewares } from '../middlewares'
/**
 * Creates a new Hono router with OpenAPI support
 * @returns Configured OpenAPIHono instance
 */
const createRouter = () => {
  return new OpenAPIHono({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: false,
            errors: result.error.issues.map((e) => ({
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
/**
 * Creates a new Hono application with all middlewares and error handlers
 * @returns Configured Hono application
 */
const createApp = () => {
  const app = createRouter()
  // Apply all global middlewares
  applyMiddlewares(app)
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
    return c.json({ success: false, error: 'An internal error occurred. Please try again.' }, 500)
  })
  return app
}
export { createApp, createRouter }
