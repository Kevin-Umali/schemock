import type { Context } from 'hono'
import { getConnInfo } from 'hono/bun'

/**
 * Checks if a string is a valid IP address (IPv4 or IPv6)
 * @param value - String to check
 * @returns Boolean indicating if the string is a valid IP
 */
export const isIp = (value: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?!$)|$)){4}$/
  const ipv6Regex =
    /^((?:[a-fA-F\d]{1,4}:){7}[a-fA-F\d]{1,4}|(?:[a-fA-F\d]{1,4}:){1,7}:|:(?::[a-fA-F\d]{1,4}){1,7}|::|(?:[a-fA-F\d]{1,4}:){1,6}:[a-fA-F\d]{1,4}|::(?:[a-fA-F\d]{1,4}:){0,5}:[a-fA-F\d]{1,4})$/

  return ipv4Regex.test(value) || ipv6Regex.test(value)
}

/**
 * Extracts client IP from request headers
 * @param c - Hono context
 * @returns Client IP or null if not found
 */
export const extractClientIpFromHeaders = (c: Context): string | null => {
  const headers = [
    'x-client-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'fastly-client-ip',
    'true-client-ip',
    'x-real-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded',
    'appengine-user-ip',
    'cf-pseudo-ipv4',
  ]

  for (const header of headers) {
    const rawValue: string | undefined = c.req.raw.headers.get(header.toLowerCase()) ?? undefined
    if (typeof rawValue === 'string') {
      const potentialIps = rawValue.split(',')
      for (const potentialIp of potentialIps) {
        const trimmedIp = potentialIp.trim()
        if (isIp(trimmedIp)) {
          return trimmedIp
        }
      }
    }
  }

  return null
}

/**
 * Cleans an IP address by removing port information
 * @param ip - IP address to clean
 * @returns Cleaned IP address
 */
const cleanIp = (ip: string): string => ip.replace(/:\d+[^:]*$/, '')

/**
 * Extracts client IP from Hono context using multiple methods
 * @param c - Hono context
 * @returns Client IP or 'unknown' if not found
 */
export const extractClientIp = (c: Context): string => {
  // Try to get IP from connection info (Bun specific)
  const connInfo = getConnInfo(c)
  if (connInfo && connInfo.remote && connInfo.remote.address) {
    let ip = cleanIp(connInfo.remote.address)
    if (isIp(ip)) {
      return ip
    }
  }

  // Try common headers
  let ip =
    c.req.raw.headers.get('x-forwarded-for') ??
    c.req.raw.headers.get('x-real-ip') ??
    c.req.raw.headers.get('cf-connecting-ip') ??
    c.req.raw.headers.get('remote-addr')

  if (ip) {
    ip = cleanIp(ip)
    if (isIp(ip)) {
      return ip
    }
  }
  
  // Try additional headers
  ip = extractClientIpFromHeaders(c)
  if (ip) {
    return ip
  }

  return 'unknown'
}
