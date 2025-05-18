import { serveStatic } from 'hono/bun'
import { createApp } from './lib/create-app'
import configureOpenAPI from './lib/configure-open-api'
import { generateRoutes, helperRoutes, mockRoutes } from './routes/index.route'

/**
 * Initialize the application
 */
const app = createApp()

// Configure OpenAPI documentation
configureOpenAPI(app)

// Register API routes
const routes = [generateRoutes, mockRoutes, helperRoutes]
const apiBasePath = '/api/v1'

// Add routes to the app
routes.forEach((route) => {
  app.route(apiBasePath, route)
})

// Create a typed API for client usage
const apiRoutes = app.basePath(apiBasePath).route('/', generateRoutes).route('/', mockRoutes).route('/', helperRoutes)

// Serve static files from the client build
app.get('*', serveStatic({ root: './client/dist' }))
app.get('*', serveStatic({ path: './client/dist/index.html' }))

// Export the app type for client-side type safety
export type HonoAppType = typeof apiRoutes

export default app
