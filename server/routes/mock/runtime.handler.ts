import type { Context } from 'hono'
import { MOCK_LIMITS } from '../../../shared/constants/mock'
import type { MockDefinition, MockEndpoint, MockResponse, MockResource } from '../../../shared/types/mock'
import type { RouteMatch } from '../../types/mock'
import { validateMockDefinition } from '../../../shared/utils/mock-definition'
import { MockQueryPaginationParams } from '../../schema/mock.schema'
import { generateFakeRecords } from '../../services/faker.service'
import { sortNestedData } from '../../utils/sort'
import { decodeMockToken } from '../../utils/decode-mock-token'

const equal = (left: unknown, right: unknown) => left === right
const pathSegments = (path: string) => path.split('/').filter(Boolean)

const pathMatch = (pattern: string, actualSegments: string[]): Record<string, string> | null => {
  const expected = pathSegments(pattern)
  if (expected.length !== actualSegments.length) return null
  const params: Record<string, string> = Object.create(null)
  for (let index = 0; index < expected.length; index += 1) {
    const segment = expected[index]
    if (segment.startsWith(':')) params[segment.slice(1)] = actualSegments[index]
    else if (segment !== actualSegments[index]) return null
  }
  return params
}

const specificity = (path: string) => pathSegments(path).filter((part) => !part.startsWith(':')).length

const matches = (scenarios: MockEndpoint['scenarios'], method: string, request: Request, body: unknown) => {
  for (const scenario of scenarios) {
    if (scenario.method && scenario.method !== method) continue
    const url = new URL(request.url)
    let matched = true
    for (const condition of scenario.conditions) {
      let actual: unknown
      if (condition.source === 'query') {
        actual = url.searchParams.get(condition.field)
        if (actual === null) {
          matched = false
          break
        }
      } else if (condition.source === 'header') {
        actual = request.headers.get(condition.field)
        if (actual === null) {
          matched = false
          break
        }
      } else {
        actual = body
        for (const part of condition.field.split('.')) {
          if (!part || !actual || typeof actual !== 'object' || !Object.hasOwn(actual, part)) {
            actual = undefined
            break
          }
          actual = (actual as Record<string, unknown>)[part]
        }
      }
      const expected = condition.source === 'body' ? condition.value : String(condition.value)
      if (!equal(actual, expected)) {
        matched = false
        break
      }
    }
    if (matched) return scenario.response
  }
  return null
}

const generated = (schema: Record<string, unknown>, count: number, locale: string, definition: MockDefinition) =>
  generateFakeRecords(schema, count, locale, { seed: definition.seed, referenceDate: definition.referenceDate })

const responseHeaders = (headers: Record<string, string>) => {
  const result = new Headers({ 'Cache-Control': 'no-store' })
  for (const [name, value] of Object.entries(headers)) result.set(name, value)
  return result
}

const finishResponse = (response: Response, method: string) =>
  method === 'HEAD' ? new Response(null, { status: response.status, headers: response.headers }) : response

const send = async (c: Context, response: MockResponse, method: string, definition: MockDefinition) => {
  if (response.delayMs > 0) await new Promise((resolve) => setTimeout(resolve, response.delayMs))
  const headers = responseHeaders(response.headers)
  if ([204, 205, 304].includes(response.status)) {
    return new Response(null, { status: response.status, headers })
  }
  if (response.kind === 'json') {
    headers.set('Content-Type', 'application/json')
    return finishResponse(new Response(response.body, { status: response.status, headers }), method)
  }
  if (response.kind === 'text') {
    headers.set('Content-Type', 'text/plain; charset=utf-8')
    return finishResponse(new Response(response.body, { status: response.status, headers }), method)
  }

  const records = generated(response.schema, response.count, response.locale, definition)
  if (response.paginated) {
    const url = new URL(c.req.url)
    for (const [key, value] of Object.entries(response.pagination ?? {})) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, String(value))
    }
    const parsed = MockQueryPaginationParams.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return finishResponse(c.json({ message: 'Invalid pagination parameters.' }, 400), method)
    const { page, limit, sort } = parsed.data
    const sorted = sort ? sortNestedData(records, ...(sort.split(':') as [string, string])) : records
    return finishResponse(
      c.json(
        { data: sorted.slice((page - 1) * limit, page * limit), page, limit, total: records.length },
        response.status as 200,
        Object.fromEntries(headers),
      ),
      method,
    )
  }
  const payload = response.count === 1 ? records[0] : records
  return finishResponse(
    new Response(JSON.stringify(payload), {
      status: response.status,
      headers: new Headers([...headers, ['Content-Type', 'application/json']]),
    }),
    method,
  )
}

const resourceRecords = (entry: MockResource, definition: MockDefinition) =>
  generated(entry.schema, entry.count, entry.locale, definition).map((record, index) => ({ ...record, id: index + 1 }))

const wait = (ms: number) => (ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve())

const pagination = (c: Context) => {
  const parsed = MockQueryPaginationParams.safeParse(Object.fromEntries(new URL(c.req.url).searchParams))
  return parsed.success ? parsed.data : null
}

const resourceResult = async (
  c: Context,
  entry: MockResource,
  id: string | undefined,
  method: string,
  body: unknown,
  definition: MockDefinition,
) => {
  const scenario = matches(entry.scenarios, method, c.req.raw, body)
  if (scenario) return send(c, scenario, method, definition)

  await wait(entry.delayMs)
  const records = resourceRecords(entry, definition)
  if (!id && method === 'GET') {
    const page = pagination(c)
    if (!page) return c.json({ message: 'Invalid pagination parameters.' }, 400)
    const sorted = page.sort ? sortNestedData(records, ...(page.sort.split(':') as [string, string])) : records
    const headers = responseHeaders(entry.headers)
    return c.json(
      {
        data: sorted.slice((page.page - 1) * page.limit, page.page * page.limit),
        page: page.page,
        limit: page.limit,
        total: records.length,
      },
      200,
      Object.fromEntries(headers),
    )
  }

  const numericId = Number(id)
  if (id && (!Number.isInteger(numericId) || numericId < 1 || numericId > entry.count))
    return c.json({ message: 'Not Found' }, 404)
  const original = id ? records.find((record) => record.id === numericId) : undefined
  if (id && !original) return c.json({ message: 'Not Found' }, 404)
  const headers = responseHeaders(entry.headers)

  if (method === 'GET')
    return original ? c.json(original, 200, Object.fromEntries(headers)) : c.json({ message: 'Not Found' }, 404)
  if (method === 'DELETE') return c.body(null, 204, Object.fromEntries(headers))
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return c.json({ message: 'Invalid JSON request body.' }, 400)
  const payload = body as Record<string, unknown>
  if (method === 'POST') {
    const baseline = generated(entry.schema, 1, entry.locale, {
      ...definition,
      seed: (definition.seed + entry.count + 1) >>> 0,
    })[0]
    return c.json({ ...baseline, ...payload, id: entry.count + 1 }, 201, Object.fromEntries(headers))
  }
  if (method === 'PUT') return c.json({ ...payload, id: numericId }, 200, Object.fromEntries(headers))
  if (method === 'PATCH' && original)
    return c.json({ ...original, ...payload, id: numericId }, 200, Object.fromEntries(headers))
  return c.json({ message: 'Not Found' }, 404)
}

const supportedMethods = (match: RouteMatch) => {
  if (match.entry.kind === 'endpoint')
    return [match.entry.method, ...(match.entry.method === 'GET' ? ['HEAD'] : []), 'OPTIONS']
  return match.resourceTarget === 'item'
    ? ['GET', 'HEAD', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    : ['GET', 'HEAD', 'POST', 'OPTIONS']
}

const selectMatch = (candidates: RouteMatch[], method: string): { selected: RouteMatch | null; allowed: string[] } => {
  if (!candidates.length) return { selected: null, allowed: [] }
  const highestSpecificity = candidates[0].specificity
  const best = candidates.filter((candidate) => candidate.specificity === highestSpecificity)
  const allowed = [...new Set(best.flatMap(supportedMethods))]
  const selected =
    best.find((candidate) => {
      const methods = supportedMethods(candidate)
      return methods.includes(method)
    }) ?? null
  return { selected, allowed }
}

export const runMockDefinition = async (c: Context) => {
  const token = c.req.param('definition')
  if (!token) return c.json({ message: 'Invalid mock definition.' }, 400)
  if (token.length > MOCK_LIMITS.encodedCharacters)
    return c.json({ message: 'Encoded mock definition exceeds the size limit.' }, 414)
  if (!/^[A-Za-z0-9_-]+$/.test(token)) return c.json({ message: 'Invalid mock definition.' }, 400)

  let definition: MockDefinition
  try {
    const decoded = await decodeMockToken(token)
    definition = validateMockDefinition(JSON.parse(decoded.toString('utf8')))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid mock definition.'
    const status = /size limit/i.test(message) ? 414 : 400
    return c.json({ message }, status)
  }

  const routeSuffix = c.req.path.slice(`/api/v1/mock/run/${token}`.length) || '/'
  let segments: string[]
  try {
    segments = pathSegments(routeSuffix).map((segment) => decodeURIComponent(segment))
  } catch {
    return c.json({ message: 'Malformed encoded route path.' }, 400)
  }
  const method = c.req.method.toUpperCase()

  const candidates: RouteMatch[] = []
  for (const entry of definition.entries) {
    const base = pathMatch(entry.path, segments)
    if (base)
      candidates.push({
        entry,
        params: base,
        specificity: specificity(entry.path),
        resourceTarget: entry.kind === 'resource' ? 'collection' : null,
      })
    if (entry.kind === 'resource') {
      const item = pathMatch(`${entry.path.replace(/\/$/, '')}/:id`, segments)
      if (item)
        candidates.push({
          entry,
          params: item,
          specificity: specificity(entry.path),
          resourceTarget: 'item',
          resourceItemId: segments.at(-1),
        })
    }
  }
  candidates.sort((a, b) => b.specificity - a.specificity)
  const { selected, allowed } = selectMatch(candidates, method)
  if (!candidates.length) return c.json({ message: 'Not Found' }, 404)
  if (!selected) return c.body(null, 405, { Allow: allowed.join(', ') })
  if (method === 'OPTIONS') return c.body(null, 204, { Allow: allowed.join(', ') })

  const responseMethod = method === 'HEAD' ? 'GET' : method
  const scenarios = selected.entry.scenarios
  const resourceWriteNeedsBody =
    selected.entry.kind === 'resource' &&
    ((selected.resourceTarget === 'collection' && responseMethod === 'POST') ||
      (selected.resourceTarget === 'item' && ['PUT', 'PATCH'].includes(responseMethod)))
  const scenarioNeedsBody = scenarios.some(
    (scenario) =>
      (!scenario.method || scenario.method === responseMethod) &&
      scenario.conditions.some((condition) => condition.source === 'body'),
  )
  const hasRequestBody = c.req.raw.body !== null
  let body: unknown
  if (resourceWriteNeedsBody || (scenarioNeedsBody && hasRequestBody)) {
    try {
      body = await c.req.json()
    } catch {
      return c.json({ message: 'Invalid JSON request body.' }, 400)
    }
  }

  if (selected.entry.kind === 'endpoint') {
    const response = matches(selected.entry.scenarios, responseMethod, c.req.raw, body) ?? selected.entry.response
    return send(c, response, method, definition)
  }
  const result = await resourceResult(c, selected.entry, selected.resourceItemId, responseMethod, body, definition)
  return method === 'HEAD' && result instanceof Response ? finishResponse(result, method) : result
}
