import { serveStatic } from 'hono/bun'
import configureOpenAPI from './lib/configure-open-api'
import { createApp } from './lib/create-app'
import { generateRoutes, helperRoutes, mockRoutes } from './routes/index.route'

const app = createApp()

configureOpenAPI(app)

const routes = [generateRoutes, mockRoutes, helperRoutes]

routes.forEach((route) => {
  app.route('/api/v1', route)
})

const apiRoutes = app.basePath('/api/v1').route('/', generateRoutes).route('/', mockRoutes).route('/', helperRoutes)

app.get('*', serveStatic({ root: './client/dist' }))
app.get('*', serveStatic({ path: './client/dist/index.html' }))

export type HonoAppType = typeof apiRoutes

export default app
