import { describe, it, expect } from 'vitest'
import { createTestEnv } from '../../test/test-utils'
import { createTestApp } from '../../test/test-app'
import generateRoutes from './generate.index'

describe('Generate Routes', () => {
  const app = createTestApp()
  app.route('/api/v1', generateRoutes)
  const { post } = createTestEnv(app)

  describe('POST /api/v1/generate/json', () => {
    it('should generate JSON data based on schema', async () => {
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
      expect(typeof data.data.name).toBe('string')
      expect(typeof data.data.email).toBe('string')
    })

    it('should generate multiple JSON records when count > 1', async () => {
      const res = await post('/api/v1/generate/json', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 3,
        locale: 'en',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toHaveProperty('data')
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBe(3)
    })

    it('should return 422 for invalid schema', async () => {
      const res = await post('/api/v1/generate/json', {
        schema: null,
        count: 1,
        locale: 'en',
      })

      expect(res.status).toBe(422)
    })
  })

  describe('POST /api/v1/generate/csv', () => {
    it('should generate CSV data based on schema', async () => {
      const res = await post('/api/v1/generate/csv', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 2,
        locale: 'en',
      })

      expect(res.status).toBe(200)
      expect(res.headers.get('Content-Type')).toContain('text/csv')
      expect(res.headers.get('Content-Disposition')).toContain('attachment')

      const text = await res.text()
      expect(text).toContain('name,email')
      // CSV should have header + 2 data rows
      expect(text.split('\n').filter((line) => line.trim()).length).toBe(3)
    })
  })

  describe('POST /api/v1/generate/sql', () => {
    it('should generate SQL insert statements', async () => {
      const res = await post('/api/v1/generate/sql', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 2,
        tableName: 'users',
        locale: 'en',
      })

      expect(res.status).toBe(200)
      expect(res.headers.get('Content-Type')).toContain('text/sql')

      const text = await res.text()
      expect(text).toContain('INSERT INTO users')
      expect(text).toContain('name')
      expect(text).toContain('email')
    })

    it('should generate multi-row insert when specified', async () => {
      const res = await post('/api/v1/generate/sql', {
        schema: {
          name: 'person.firstName',
          email: 'internet.email',
        },
        count: 2,
        tableName: 'users',
        multiRowInsert: true,
        locale: 'en',
      })

      expect(res.status).toBe(200)

      const text = await res.text()
      expect(text).toContain('INSERT INTO users')
      expect(text.match(/VALUES/g)?.length).toBe(1) // Only one VALUES keyword for multi-row insert
    })
  })

  describe('POST /api/v1/generate/template', () => {
    it('should generate data from template', async () => {
      const res = await post('/api/v1/generate/template', {
        template: 'Hello, my name is {{person.firstName}} and my email is {{internet.email}}.',
        count: 1,
        locale: 'en',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toHaveProperty('data')
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data[0]).toContain('Hello, my name is')
      expect(data.data[0]).toContain('and my email is')
    })

    it('should return 422 for invalid template', async () => {
      const res = await post('/api/v1/generate/template', {
        template: null,
        count: 1,
        locale: 'en',
      })

      expect(res.status).toBe(422)
    })
  })
})
