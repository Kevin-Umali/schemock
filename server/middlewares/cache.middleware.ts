import type { Context, MiddlewareHandler } from 'hono'
import { config } from '../config'
import type { CacheTTL, CacheOptions, CachedResponse } from '../types/cache'
/** Cache public metadata without retaining streams or request-specific headers. */
export const createCache = (ttl: CacheTTL, options?: CacheOptions): MiddlewareHandler => {
  const seconds = typeof ttl === 'string' ? config.cache.ttl[ttl] : ttl
  const cache = new Map<string, CachedResponse>()
  const cacheControl = options?.cacheControl ?? `public, max-age=${seconds}`
  const vary = options?.vary ?? []
  return async (c, next) => {
    if (c.req.method !== 'GET') return next()
    const key = generateCacheKey(c, vary)
    const now = Date.now()
    const cached = cache.get(key)
    c.header('Cache-Control', cacheControl)
    if (vary.length) c.header('Vary', vary.join(', '), { append: true })
    if (cached && cached.expires > now) {
      c.header('Content-Type', cached.contentType)
      return c.body(cached.body, cached.status)
    }
    cache.delete(key)
    await next()
    if (c.res.status !== 200) {
      c.header('Cache-Control', 'no-store')
      return
    }
    try {
      const body = await c.res.clone().text()
      for (const [entry, value] of cache) {
        if (value.expires <= now) cache.delete(entry)
      }
      // Bound memory even when requests contain many distinct query strings.
      if (cache.size >= 200) cache.delete(cache.keys().next().value!)
      cache.set(key, {
        body,
        contentType: c.res.headers.get('Content-Type') ?? 'application/json',
        status: 200,
        expires: now + seconds * 1000,
      })
    } catch (error) {
      console.error('Could not cache metadata:', error)
    }
  }
}
export const generateCacheKey = (c: Context, vary: string[] = []): string => {
  const url = new URL(c.req.url)
  return JSON.stringify([c.req.method, url.pathname, url.search, ...vary.map((name) => c.req.header(name) ?? '')])
}
