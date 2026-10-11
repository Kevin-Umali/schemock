import { createRouter } from '../../lib/create-app'
import { createCache } from '../../middlewares/cache.middleware'
import * as mockRoutes from './mock.route'
import * as mockHandlers from './mock.handler'
import { runMockDefinition } from './runtime.handler'
// Create a router for mock routes
const router = createRouter()
// Apply caching to mock routes (short TTL - 1 minute)
router.use(
  '/mock/*',
  createCache('short', {
    vary: ['Accept', 'Content-Type'],
  }),
)
// Register routes with OpenAPI
router.openapi(mockRoutes.paginationRoute, mockHandlers.paginationHandler)
router.all('/mock/run/:definition/*', runMockDefinition)
router.all('/mock/run/:definition', runMockDefinition)
export default router
