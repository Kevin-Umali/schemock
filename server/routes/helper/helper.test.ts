import { describe, it, expect } from 'vitest'
import { createTestEnv } from '../../test/test-utils'
import { createTestApp } from '../../test/test-app'
import helperRoutes from './helper.index'

describe('Helper Routes', () => {
  const app = createTestApp()
  app.route('/api/v1', helperRoutes)
  const { get } = createTestEnv(app)

  describe('GET /api/v1/helper/enum/:name', () => {
    it('should return 200 for faker enum', async () => {
      const res = await get('/api/v1/helper/enum/faker')
      expect(res.status).toBe(200)
    })

    it('should return 200 for locale enum', async () => {
      const res = await get('/api/v1/helper/enum/locale')
      expect(res.status).toBe(200)
    })

    it('should return 422 for unknown enum name', async () => {
      const res = await get('/api/v1/helper/enum/unknown')
      expect(res.status).toBe(422)
    })
  })

  describe('GET /api/v1/helper/faker', () => {
    it('should return 200 for faker methods', async () => {
      const res = await get('/api/v1/helper/faker')
      expect(res.status).toBe(200)
    })
  })
})
