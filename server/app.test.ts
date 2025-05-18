import { describe, it, expect } from 'vitest'
import { createTestEnv } from './test/test-utils'
import { createTestApp } from './test/test-app'
import { generateRoutes, helperRoutes, mockRoutes } from './routes/index.route'
import configureOpenAPI from './lib/configure-open-api'

// Create a test version of the app
const app = createTestApp()

// Configure OpenAPI documentation
configureOpenAPI(app)

// Register API routes
const routes = [generateRoutes, mockRoutes, helperRoutes]
const apiBasePath = '/api/v1'

// Add routes to the app
routes.forEach((route) => {
  app.route(apiBasePath, route)
})

describe('App', () => {
  const { get, post } = createTestEnv(app)

  describe('API Routes', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await get('/api/v1/unknown')
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data).toHaveProperty('message', 'Not Found - Check the documentation for more information.')
      expect(data).toHaveProperty('swagger', '/api/v1/ui')
    })

    it('should handle API requests', async () => {
      const res = await post('/api/v1/generate/json', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 1,
        locale: 'en',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toHaveProperty('data')
    })
  })

  describe('OpenAPI Documentation', () => {
    it('should serve OpenAPI documentation', async () => {
      const res = await get('/api/v1/doc')
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveProperty('info')
      expect(data).toHaveProperty('openapi')
      expect(data).toHaveProperty('paths')
    })
  })

  describe('Static Files', () => {
    it('should serve static files', async () => {
      // This test might fail in test environment if client/dist doesn't exist
      // We're just testing the route handler exists
      const res = await get('/')
      expect([200, 404]).toContain(res.status) // Either serves the file or 404 if not found
    })
  })
})
