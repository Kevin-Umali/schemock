import { createRouter } from '../../lib/create-app'

import * as generateRoutes from './generate.route'
import * as generateHandlers from './generate.handler'

const router = createRouter()
  .openapi(generateRoutes.jsonRoute, generateHandlers.jsonHandler)
  .openapi(generateRoutes.csvRoute, generateHandlers.csvHandler)
  .openapi(generateRoutes.sqlRoute, generateHandlers.sqlHandler)
  .openapi(generateRoutes.templateRoute, generateHandlers.templateHandler)

export default router
