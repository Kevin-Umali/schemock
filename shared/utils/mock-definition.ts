import { MOCK_LIMITS, MOCK_METHODS } from '../constants/mock'
import type { MockDefinition, MockResponse, MockSchema } from '../types/mock'

const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)
const fail = (message: string): never => {
  throw new Error(message)
}
const safeHeaders = (value: unknown): value is Record<string, string> => {
  if (!object(value)) return false
  return Object.entries(value).every(
    ([name, content]) =>
      /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name) &&
      typeof content === 'string' &&
      content.length <= 2048 &&
      !/^(access-control-|set-cookie|cookie$|authorization$|www-authenticate$|content-length$|content-type$|content-encoding$|content-range$|connection$|keep-alive$|te$|trailer$|transfer-encoding$|upgrade$|host$|location$|refresh$|cache-control$|pragma$|content-security-policy(-report-only)?$|strict-transport-security$|x-frame-options$|x-content-type-options$|referrer-policy$|x-xss-protection$|x-dns-prefetch-control$|permissions-policy$|x-download-options$|x-permitted-cross-domain-policies$|cross-origin-opener-policy$|cross-origin-embedder-policy$|cross-origin-resource-policy$|origin-agent-cluster$)/i.test(
        name,
      ) &&
      !/[^\t\x20-\x7e\x80-\xff]/.test(content),
  )
}

const hasUnsafeResponseHeaders = (response: unknown) =>
  object(response) && Object.hasOwn(response, 'headers') && !safeHeaders(response.headers)

const hasUnsafeScenarioHeaders = (value: unknown) =>
  Array.isArray(value) && value.some((scenario) => object(scenario) && hasUnsafeResponseHeaders(scenario.response))
const schemaCheck = (value: unknown, records = 1): value is MockSchema => {
  if (!object(value)) return false
  let cost = 0
  const visit = (current: unknown, depth: number, multiplier: number, allowScalar = false): boolean => {
    cost += multiplier
    if (cost > 10000 || depth > 32) return false
    if (
      current === null ||
      ['string', 'boolean'].includes(typeof current) ||
      (typeof current === 'number' && Number.isFinite(current))
    )
      return allowScalar
    if (!object(current) || Object.keys(current).length > 100) return false
    for (const [key, child] of Object.entries(current)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) return false
      if (
        child === null ||
        ['string', 'boolean'].includes(typeof child) ||
        (typeof child === 'number' && Number.isFinite(child))
      ) {
        cost += multiplier
        if (cost > 10000) return false
        continue
      }
      if (object(child) && Object.keys(child).length === 2 && 'items' in child && 'count' in child) {
        if (
          !Number.isInteger(child.count) ||
          Number(child.count) < 1 ||
          Number(child.count) > 100 ||
          !visit(child.items, depth + 1, multiplier * Number(child.count), true)
        )
          return false
        continue
      }
      if (!visit(child, depth + 1, multiplier, false)) return false
    }
    return true
  }
  return visit(value, 0, records)
}
const responseCheck = (v: unknown): v is MockResponse => {
  if (
    !object(v) ||
    !Number.isInteger(v.status) ||
    Number(v.status) < 200 ||
    Number(v.status) > 599 ||
    !safeHeaders(v.headers) ||
    !Number.isInteger(v.delayMs) ||
    Number(v.delayMs) < 0 ||
    Number(v.delayMs) > MOCK_LIMITS.delayMs
  )
    return false
  if (v.kind === 'json' || v.kind === 'text') {
    if (typeof v.body !== 'string' || v.body.length > 65536) return false
    if (v.kind === 'json') {
      try {
        JSON.parse(v.body)
      } catch {
        return false
      }
    }
    return true
  }
  const paginationCheck = (value: unknown) =>
    object(value) &&
    Number.isSafeInteger(value.page) &&
    Number(value.page) >= 1 &&
    Number.isInteger(value.limit) &&
    Number(value.limit) >= 1 &&
    Number(value.limit) <= 100 &&
    (value.sort === undefined || (typeof value.sort === 'string' && /^[\w.]+:(asc|desc)$/.test(value.sort)))
  return (
    v.kind === 'generated' &&
    Number.isInteger(v.count) &&
    Number(v.count) >= 1 &&
    Number(v.count) <= 100 &&
    schemaCheck(v.schema, Number(v.count)) &&
    typeof v.locale === 'string' &&
    /^[A-Za-z]{2,3}(?:[_-][A-Za-z]{2,4})?$/.test(v.locale) &&
    (v.paginated === undefined || typeof v.paginated === 'boolean') &&
    (v.pagination === undefined || paginationCheck(v.pagination))
  )
}
const scenariosCheck = (v: unknown): boolean =>
  Array.isArray(v) &&
  v.length <= MOCK_LIMITS.scenarios &&
  v.every(
    (s) =>
      object(s) &&
      typeof s.name === 'string' &&
      s.name.length <= 100 &&
      (s.method === undefined || (MOCK_METHODS as readonly unknown[]).includes(s.method)) &&
      Array.isArray(s.conditions) &&
      s.conditions.length <= 20 &&
      s.conditions.every(
        (c) =>
          object(c) &&
          ['query', 'header', 'body'].includes(String(c.source)) &&
          typeof c.field === 'string' &&
          c.field.length > 0 &&
          c.field.length <= 200 &&
          (c.value === null || ['string', 'number', 'boolean'].includes(typeof c.value)),
      ) &&
      responseCheck(s.response),
  )

export const validateMockDefinition = (input: unknown): MockDefinition => {
  if (
    !object(input) ||
    input.version !== 1 ||
    !Number.isInteger(input.seed) ||
    Number(input.seed) < 0 ||
    Number(input.seed) > 0xffffffff ||
    typeof input.referenceDate !== 'string' ||
    !Number.isFinite(Date.parse(input.referenceDate)) ||
    !Array.isArray(input.entries)
  )
    fail('Invalid mock definition.')
  const definition = input as Record<string, unknown>
  if ((definition.entries as unknown[]).length > MOCK_LIMITS.entries)
    fail(`Mock definitions support at most ${MOCK_LIMITS.entries} entries.`)
  const routes = new Set<string>()
  const canonical = (path: string) =>
    `/${path
      .split('/')
      .filter(Boolean)
      .map((part) => (/^:[A-Za-z][A-Za-z0-9_]*$/.test(part) ? ':' : part))
      .join('/')}`
  for (const entry of definition.entries as unknown[]) {
    if (!object(entry) || typeof entry.path !== 'string') fail('Invalid mock route path.')
    const entryObj = entry as Record<string, unknown>
    const routePath = entryObj.path as string
    if (
      !routePath.startsWith('/') ||
      routePath.includes('?') ||
      routePath.includes('#') ||
      routePath
        .split('/')
        .some(
          (part: string) =>
            part === '..' || part === '.' || (part.includes(':') && !/^:[A-Za-z][A-Za-z0-9_]*$/.test(part)),
        )
    )
      fail('Invalid mock route path.')
    if (routePath.split('/').filter(Boolean).length > 20) fail('Mock route path is too deep.')
    if (entryObj.kind === 'endpoint') {
      if (Array.isArray(entryObj.scenarios) && entryObj.scenarios.length > MOCK_LIMITS.scenarios)
        fail(`Each endpoint supports at most ${MOCK_LIMITS.scenarios} scenarios.`)
      if (hasUnsafeResponseHeaders(entryObj.response) || hasUnsafeScenarioHeaders(entryObj.scenarios))
        fail('Mock response headers contain invalid values or protected transport and security headers.')
      if (
        !(MOCK_METHODS as readonly unknown[]).includes(entryObj.method) ||
        !responseCheck(entryObj.response) ||
        !scenariosCheck(entryObj.scenarios)
      )
        fail('Invalid mock endpoint.')
      const key = `${entryObj.method} ${canonical(routePath)}`
      if (routes.has(key)) fail('Duplicate mock route.')
      routes.add(key)
    } else if (entryObj.kind === 'resource') {
      if (Array.isArray(entryObj.scenarios) && entryObj.scenarios.length > MOCK_LIMITS.scenarios)
        fail(`Each resource supports at most ${MOCK_LIMITS.scenarios} scenarios.`)
      if (!safeHeaders(entryObj.headers) || hasUnsafeScenarioHeaders(entryObj.scenarios))
        fail('Mock resource headers contain invalid values or protected transport and security headers.')
      if (
        !Number.isInteger(entryObj.count) ||
        Number(entryObj.count) < 1 ||
        Number(entryObj.count) > 100 ||
        !schemaCheck(entryObj.schema, Number(entryObj.count)) ||
        typeof entryObj.locale !== 'string' ||
        !safeHeaders(entryObj.headers) ||
        !Number.isInteger(entryObj.delayMs) ||
        Number(entryObj.delayMs) < 0 ||
        Number(entryObj.delayMs) > MOCK_LIMITS.delayMs ||
        !scenariosCheck(entryObj.scenarios)
      )
        fail('Invalid mock resource.')
      const base = canonical(routePath)
      for (const key of [
        `GET ${base}`,
        'POST ' + base,
        ...(['GET', 'PUT', 'PATCH', 'DELETE'] as const).map((method) => `${method} ${base === '/' ? '' : base}/:`),
      ]) {
        if (routes.has(key)) fail('Duplicate mock route.')
        routes.add(key)
      }
    } else fail('Invalid mock entry.')
  }
  if (new TextEncoder().encode(JSON.stringify(definition)).length > MOCK_LIMITS.decodedBytes)
    fail('Mock definition exceeds the size limit.')
  return definition as unknown as MockDefinition
}
