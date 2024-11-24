import { createRouter } from '../../lib/create-app'

import * as mockRoutes from './mock.route'
import * as mockHandlers from './mock.handler'

const router = createRouter().openapi(mockRoutes.paginationRoute, mockHandlers.paginationHandler)

export default router
