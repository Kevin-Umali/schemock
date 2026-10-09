import { isIP } from 'node:net'
import type { Context } from 'hono'

export const isIp = (value: string): boolean => isIP(value) !== 0

export const extractClientIpFromHeaders = (c: Context): string | null => {
  const forwarded = c.req.header('X-Forwarded-For')?.split(',')[0]?.trim()
  return forwarded && isIp(forwarded) ? forwarded : null
}

export const extractClientIp = (c: Context): string => {
  if (process.env.TRUST_PROXY === 'true') {
    const forwarded = extractClientIpFromHeaders(c)
    if (forwarded) return forwarded
  }
  const server = c.env?.server ?? c.env
  const address = server?.requestIP?.(c.req.raw)?.address
  return typeof address === 'string' && isIp(address) ? address : 'unknown'
}
