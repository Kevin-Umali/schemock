import { createRouter } from '../../lib/create-app'
import { createCache } from '../../middlewares/cache.middleware'
import * as helperRoutes from './helper.route'
import * as helperHandlers from './helper.handler'

// Create a router for helper routes
const router = createRouter()

// Apply caching to helper routes (long TTL - 1 hour)
router.use(
  '/helper/*',
  createCache('long', {
    vary: ['Accept'],
  }),
)

// Register routes with OpenAPI
router.openapi(helperRoutes.enumRoute, helperHandlers.enumHandler).openapi(helperRoutes.fakerMethodRoute, helperHandlers.fakerMethodHandler)

export default router
