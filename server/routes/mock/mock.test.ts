import { describe, it, expect } from 'vitest'
import { createTestEnv } from '../../test/test-utils'
import { createTestApp } from '../../test/test-app'
import mockRoutes from './mock.index'

describe('Mock Routes', () => {
  const app = createTestApp()
  app.route('/api/v1', mockRoutes)
  const { post } = createTestEnv(app)

  describe('POST /api/v1/mock/pagination', () => {
    it('should generate paginated data', async () => {
      const res = await post('/api/v1/mock/pagination?page=1&limit=10', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 20,
        locale: 'en',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      expect(data).toHaveProperty('data')
      expect(data).toHaveProperty('page', 1)
      expect(data).toHaveProperty('limit', 10)
      expect(data).toHaveProperty('total')

      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBe(10) // Should match the limit
    })

    it('should handle pagination parameters correctly', async () => {
      const res = await post('/api/v1/mock/pagination?page=2&limit=5', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 20,
        locale: 'en',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      expect(data).toHaveProperty('page', 2)
      expect(data).toHaveProperty('limit', 5)
      expect(data.data.length).toBe(5) // Should match the limit
    })

    it('should handle sorting parameter', async () => {
      const res = await post('/api/v1/mock/pagination?sort=name:asc', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 20,
        locale: 'en',
      })

      expect(res.status).toBe(200)
      const data = await res.json()

      // Check if data is sorted by name in ascending order
      const names = data.data.map((item: any) => item.name)
      const sortedNames = [...names].sort()
      expect(names).toEqual(sortedNames)
    })

    it('should return 422 for invalid schema', async () => {
      const res = await post('/api/v1/mock/pagination', {
        schema: null,
        count: 20,
        locale: 'en',
      })

      expect(res.status).toBe(422)
    })
  })
})
