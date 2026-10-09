import { serveStatic } from 'hono/bun'
import { createApp } from './lib/create-app'
import configureOpenAPI from './lib/configure-open-api'
import { generateRoutes, helperRoutes, mockRoutes } from './routes/index.route'
const app = createApp()
configureOpenAPI(app)
app.route('/api/v1', generateRoutes).route('/api/v1', mockRoutes).route('/api/v1', helperRoutes)
app.all('/api/*', (c) =>
  c.json({ message: 'Not Found - Check the documentation for more information.', swagger: '/api/v1/ui' }, 404),
)
app.get('*', serveStatic({ root: './client/dist' }))
app.get('*', serveStatic({ path: './client/dist/index.html' }))
export default app
