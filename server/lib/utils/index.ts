import type { Context } from 'hono'
import { getConnInfo } from 'hono/bun'

// prettier-ignore
export const generateSingleRowInsertStatements = (results: Record<string, any>[], tableName: string): string => {
  return results
    .map((record) => {
      const columns = Object.keys(record).join(", ");
      const values = Object.values(record)
        .map((value) => {
          if (value === null || value === undefined) {
            return 'NULL';
          }
          if (typeof value === 'object') {
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          return `'${String(value).replace(/'/g, "''")}'`;
        })
        .join(", ");
      return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
    })
    .join("\n");
};

// prettier-ignore
export const generateMultiRowInsertStatement = (results: Record<string, any>[], tableName: string): string => {
  if (results.length === 0) {
    return '';
  }

  const columns = Object.keys(results[0]).join(", ");
  const values = results
    .map((record, index) => {
      const formattedValues = Object.values(record)
        .map((value) => {
          if (value === null || value === undefined) {
            return 'NULL';
          }
          if (typeof value === 'object') {
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          return `'${String(value).replace(/'/g, "''")}'`;
        })
        .join(", ");
      return index === 0 ? `(${formattedValues})` : `\t(${formattedValues})`;
    })
    .join(",\n");
  return `INSERT INTO ${tableName} (${columns}) VALUES ${values};`;
};

export const isIp = (value: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?!$)|$)){4}$/
  const ipv6Regex =
    /^((?:[a-fA-F\d]{1,4}:){7}[a-fA-F\d]{1,4}|(?:[a-fA-F\d]{1,4}:){1,7}:|:(?::[a-fA-F\d]{1,4}){1,7}|::|(?:[a-fA-F\d]{1,4}:){1,6}:[a-fA-F\d]{1,4}|::(?:[a-fA-F\d]{1,4}:){0,5}:[a-fA-F\d]{1,4})$/

  return ipv4Regex.test(value) || ipv6Regex.test(value)
}

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

export const sortNestedData = (data: any[], sortField: string, sortOrder: string) => {
  const fields = sortField.split('.')
  return data.sort((a: any, b: any) => {
    let aValue = a
    let bValue = b

    for (const field of fields) {
      aValue = aValue[field]
      bValue = bValue[field]
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
}

export const extractClientIp = (c: Context): string => {
  const connInfo = getConnInfo(c)
  if (connInfo && connInfo.remote && connInfo.remote.address) {
    let ip = cleanIp(connInfo.remote.address)
    if (isIp(ip)) {
      return ip
    }
  }

  let ip =
    c.req.raw.headers.get('x-forwarded-for') ??
    c.req.raw.headers.get('x-real-ip') ??
    c.req.raw.headers.get('cf-connecting-ip') ??
    c.req.raw.headers.get('remote-addr')

  if (ip) {
    ip = cleanIp(ip)
    if (isIp(ip)) {
      console.log('clientIp (from headers):', ip)
      return ip
    }
  }
  ip = extractClientIpFromHeaders(c)
  if (ip) {
    console.log('clientIp (from additional headers):', ip)
    return ip
  }

  console.warn("Warning: Unable to extract client IP, defaulting to 'unknown'")
  return 'unknown'
}

const cleanIp = (ip: string): string => ip.replace(/:\d+[^:]*$/, '')
