import { createRouter } from '../../lib/create-app'

import * as helperRoutes from './helper.route'
import * as helperHandlers from './helper.handler'

const router = createRouter().openapi(helperRoutes.enumRoute, helperHandlers.enumHandler)

export default router
