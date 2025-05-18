import { describe, it, expect } from 'vitest'
import type { OpenAPIHono } from '@hono/zod-openapi'
import type { MiddlewareHandler } from 'hono'

/**
 * Creates a test environment for Hono routes
 * @param app - The Hono app to test
 * @returns Test utilities for the app
 */
export const createTestEnv = <T extends OpenAPIHono>(app: T) => {
  /**
   * Helper function to make a request to the app
   * @param path - The path to request
   * @param options - Request options
   * @param env - Environment variables to pass to the request
   * @returns The response from the app
   */
  const request = async (path: string, options: RequestInit = {}, env: Record<string, any> = {}): Promise<Response> => {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }

    const url = new URL(path, 'http://localhost')
    const req = new Request(url, options)
    return app.fetch(req, env)
  }

  /**
   * Helper function to make a GET request to the app
   * @param path - The path to request
   * @param options - Request options
   * @param env - Environment variables to pass to the request
   * @returns The response from the app
   */
  const get = (path: string, options: RequestInit = {}, env: Record<string, any> = {}) => {
    return request(path, { ...options, method: 'GET' }, env)
  }

  /**
   * Helper function to make a POST request to the app
   * @param path - The path to request
   * @param body - The body to send with the request
   * @param options - Request options
   * @param env - Environment variables to pass to the request
   * @returns The response from the app
   */
  const post = (path: string, body: any, options: RequestInit = {}, env: Record<string, any> = {}) => {
    const headers = new Headers(options.headers)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    return request(
      path,
      {
        ...options,
        method: 'POST',
        headers,
        body: typeof body === 'string' ? body : JSON.stringify(body),
      },
      env,
    )
  }

  return {
    app,
    request,
    get,
    post,
  }
}

/**
 * Creates a mock middleware for testing
 * @param name - The name of the middleware
 * @returns A middleware that adds a header with the name
 */
export const createMockMiddleware = (name: string): MiddlewareHandler => {
  return async (c, next) => {
    c.header(`X-Middleware-${name}`, 'true')
    await next()
  }
}

export { describe, it, expect }
