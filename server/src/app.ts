import configureOpenAPI from './lib/configure-open-api'
import { createApp } from './lib/create-app'
import { generateRoutes, helperRoutes, mockRoutes } from './routes/index.route'

const app = createApp()

configureOpenAPI(app)

const routes = [generateRoutes, mockRoutes, helperRoutes] as const

routes.forEach((route) => {
  app.route('/', route)
})

export type HonoAppType = (typeof routes)[number]

export default app
