import type { MiddlewareHandler } from 'hono'
import type { LogLevel, LoggerConfig } from '../types/logger'
/** Log request outcomes without bodies, query strings, or forwarded identity headers. */
export const enhancedLogger = ({
  level = 'info',
  excludePaths = ['/health', '/metrics', '/favicon.ico'],
  enabled = true,
  mode = 'pretty',
}: LoggerConfig = {}): MiddlewareHandler => {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
  return async (c, next) => {
    if (!enabled || excludePaths.includes(c.req.path)) return next()
    const start = performance.now()
    const requestId = crypto.randomUUID()
    c.set('requestId', requestId)
    await next()
    const status = c.res.status
    const severity = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    if (levels.indexOf(severity) < levels.indexOf(level)) return
    const entry = {
      timestamp: new Date().toISOString(),
      level: severity,
      requestId,
      method: c.req.method,
      path: c.req.path,
      status,
      duration: Math.round(performance.now() - start),
    }
    const message =
      mode === 'json' ? JSON.stringify(entry) : `${entry.method} ${entry.path} ${status} ${entry.duration}ms`
    console[severity](message)
  }
}
