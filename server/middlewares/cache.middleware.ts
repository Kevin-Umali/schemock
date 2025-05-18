import type { Context, MiddlewareHandler, Next } from 'hono'
import { config } from '../config'

type CacheTTL = 'short' | 'medium' | 'long' | number

interface CacheOptions {
  cacheControl?: string
  vary?: string[]
}

// In-memory cache storage
const memoryCache = new Map<string, { response: Response; expires: number }>()

/**
 * Creates a cache middleware with the specified TTL
 * @param ttl - Time to live in seconds or predefined duration ('short', 'medium', 'long')
 * @param options - Additional cache options
 * @returns Middleware handler with caching
 */
export const createCache = (ttl: CacheTTL, options?: CacheOptions): MiddlewareHandler => {
  // Convert named TTL to seconds
  const ttlInSeconds = typeof ttl === 'string' ? config.cache.ttl[ttl] : ttl

  // Generate cache control header based on TTL
  const cacheControl = options?.cacheControl ?? `max-age=${ttlInSeconds}, s-maxage=${ttlInSeconds}`

  return async (c: Context, next: Next): Promise<Response | void> => {
    // Skip caching for non-GET requests
    if (c.req.method !== 'GET') {
      return next()
    }

    try {
      // Generate a cache key
      const cacheKey = generateCacheKey(c)

      // Try to get from cache
      const now = Date.now()
      const cachedItem = memoryCache.get(cacheKey)

      if (cachedItem && cachedItem.expires > now) {
        // Return cached response if not expired
        return cachedItem.response.clone()
      }

      // If not in cache or expired, continue to handler
      await next()

      // After handler execution, cache the response
      if (c.res && c.res.status >= 200 && c.res.status < 300) {
        // Clone the response to cache it
        const responseToCache = new Response(c.res.body, {
          status: c.res.status,
          statusText: c.res.statusText,
          headers: new Headers(c.res.headers),
        })

        // Add cache headers
        responseToCache.headers.set('Cache-Control', cacheControl)

        // Add Vary headers if specified
        if (options?.vary && options.vary.length > 0) {
          responseToCache.headers.set('Vary', options.vary.join(', '))
        }

        // Store in cache with expiration
        memoryCache.set(cacheKey, {
          response: responseToCache.clone(),
          expires: now + ttlInSeconds * 1000,
        })

        // Clean up expired cache entries periodically
        if (memoryCache.size > 100) {
          cleanupExpiredCache()
        }
      }

      return c.res
    } catch (error) {
      console.error('Cache middleware error:', error instanceof Error ? error.message : String(error))
      return next()
    }
  }
}

/**
 * Generates a cache key from the request
 * @param c - Hono context
 * @returns Cache key string
 */
export const generateCacheKey = (c: Context): string => {
  const url = new URL(c.req.url)
  const method = c.req.method

  // For GET requests, use URL as key
  return `${method}:${url.pathname}${url.search}`
}

/**
 * Cleans up expired cache entries
 */
function cleanupExpiredCache(): void {
  const now = Date.now()
  for (const [key, value] of memoryCache.entries()) {
    if (value.expires <= now) {
      memoryCache.delete(key)
    }
  }
}
