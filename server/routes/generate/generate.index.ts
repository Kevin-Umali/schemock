import { createRouter } from '../../lib/create-app'
import { createCache } from '../../middlewares/cache.middleware'
import * as generateRoutes from './generate.route'
import * as generateHandlers from './generate.handler'

// Create a router for generate routes
const router = createRouter()

// Apply caching to generate routes (medium TTL - 5 minutes)
router.use(
  '/generate/*',
  createCache('medium', {
    vary: ['Accept', 'Content-Type'],
  }),
)

// Register routes with OpenAPI
router
  .openapi(generateRoutes.jsonRoute, generateHandlers.jsonHandler)
  .openapi(generateRoutes.csvRoute, generateHandlers.csvHandler)
  .openapi(generateRoutes.sqlRoute, generateHandlers.sqlHandler)
  .openapi(generateRoutes.templateRoute, generateHandlers.templateHandler)

export default router
