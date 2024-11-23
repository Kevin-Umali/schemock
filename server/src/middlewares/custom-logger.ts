import type { MiddlewareHandler } from 'hono'

type LogLevel = 'info' | 'error' | 'debug' | 'warn'

interface LoggerConfig {
  level?: LogLevel
  excludePaths?: string[]
  enabled?: boolean
  mode?: 'pretty' | 'json'
}

interface LogInfo {
  timestamp: string
  level: LogLevel
  method: string
  path: string
  requestId: string
  status?: number
  duration?: number
  userAgent?: string
  contentLength?: number
  error?: Error
  ip?: string
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
} as const

const levelColors: Record<LogLevel, string> = {
  info: colors.blue,
  error: colors.red,
  warn: colors.yellow,
  debug: colors.gray,
}

const symbols: Record<LogLevel | 'response', string> = {
  info: '○',
  error: '✖',
  warn: '⚠',
  debug: '→',
  response: '←',
} as const

const formatDuration = (ms: number): string => {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

const formatPretty = (info: LogInfo): string => {
  const timestamp = `${colors.gray}${info.timestamp}${colors.reset}`
  const reqId = `${colors.magenta}${info.requestId.slice(0, 8)}${colors.reset}`
  const level = `${levelColors[info.level]}${info.level.toUpperCase().padEnd(5)}${colors.reset}`
  const method = `${colors.cyan}${info.method.padEnd(7)}${colors.reset}`
  const path = `${colors.blue}${info.path}${colors.reset}`

  // Error formatting
  if (info.error) {
    return [
      timestamp,
      reqId,
      level,
      symbols.error,
      method,
      path,
      `${colors.red}${info.error.message}${colors.reset}`,
      info.duration && `${colors.yellow}${formatDuration(info.duration)}${colors.reset}`,
      info.ip && `${colors.cyan}IP:${colors.reset} ${colors.gray}${info.ip}${colors.reset}`,
      info.userAgent && `${colors.cyan}UA:${colors.reset} ${colors.gray}${info.userAgent}${colors.reset}`,
    ]
      .filter(Boolean)
      .join(' ')
  }

  // Request formatting
  if (!info.status) {
    return [
      timestamp,
      reqId,
      level,
      symbols.debug,
      method,
      path,
      info.ip && `${colors.cyan}IP:${colors.reset} ${colors.gray}${info.ip}${colors.reset}`,
      info.userAgent && `${colors.cyan}UA:${colors.reset} ${colors.gray}${info.userAgent}${colors.reset}`,
    ]
      .filter(Boolean)
      .join(' ')
  }

  // Response formatting
  const status = `${getStatusColor(info.status)}${info.status}${colors.reset}`
  const duration = `${colors.yellow}${formatDuration(info.duration!)}${colors.reset}`
  const size = info.contentLength ? `${colors.cyan}${(info.contentLength / 1024).toFixed(2)}kb${colors.reset}` : `${colors.gray}-${colors.reset}`

  return [
    timestamp,
    reqId,
    level,
    symbols.response,
    method,
    path,
    status,
    duration,
    size,
    info.ip && `${colors.cyan}IP:${colors.reset} ${colors.gray}${info.ip}${colors.reset}`,
    info.userAgent && `${colors.cyan}UA:${colors.reset} ${colors.gray}${info.userAgent}${colors.reset}`,
  ]
    .filter(Boolean)
    .join(' ')
}

const getStatusColor = (status: number): string => {
  if (status >= 500) return colors.red
  if (status >= 400) return colors.yellow
  if (status >= 300) return colors.magenta
  if (status >= 200) return colors.green
  return colors.gray
}

const shouldLog = (configLevel: LogLevel, messageLevel: LogLevel): boolean => {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
  return levels.indexOf(messageLevel) >= levels.indexOf(configLevel)
}

export const enhancedLogger = (config: LoggerConfig = {}): MiddlewareHandler => {
  const { level = 'info', excludePaths = ['/health', '/metrics', '/favicon.ico'], enabled = true, mode = 'pretty' } = config

  if (!enabled) return (_, next) => next()

  return async (c, next) => {
    const path = new URL(c.req.raw.url).pathname
    if (excludePaths.includes(path)) return await next()

    const requestId = crypto.randomUUID()
    c.set('requestId', requestId) // Make available to other middleware/handlers

    const startTime = performance.now()
    const method = c.req.method
    const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip')
    const userAgent = c.req.header('user-agent')

    const baseInfo = {
      timestamp: new Date().toISOString(),
      requestId,
      method,
      path,
      ip,
      userAgent,
    }

    // Log request
    const requestInfo: LogInfo = {
      ...baseInfo,
      level: 'debug',
    }

    if (shouldLog(level, 'debug')) {
      mode === 'pretty' ? console.log(formatPretty(requestInfo)) : console.log(JSON.stringify(requestInfo))
    }

    try {
      await next()

      // Log response
      const responseInfo: LogInfo = {
        ...baseInfo,
        level: 'info',
        status: c.res.status,
        duration: performance.now() - startTime,
        contentLength: parseInt(c.res.headers.get('content-length') ?? '0'),
      }

      if (shouldLog(level, 'info')) {
        mode === 'pretty' ? console.log(formatPretty(responseInfo)) : console.log(JSON.stringify(responseInfo))
      }
    } catch (err) {
      const errorInfo: LogInfo = {
        ...baseInfo,
        level: 'error',
        duration: performance.now() - startTime,
        error: err instanceof Error ? err : new Error(String(err)),
      }

      if (shouldLog(level, 'error')) {
        mode === 'pretty' ? console.error(formatPretty(errorInfo)) : console.error(JSON.stringify(errorInfo))
      }
      throw err
    }
  }
}
