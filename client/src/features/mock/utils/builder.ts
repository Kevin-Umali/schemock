import type {
  MockDefinition,
  MockEndpoint,
  MockEntry,
  MockResource,
  MockResponse,
  MockScenario,
} from '../types/definition'

export const freshMockSeed = (): number => crypto.getRandomValues(new Uint32Array(1))[0]

export const nextMockPath = (entries: MockEntry[], prefix: string): string => {
  let index = 1
  while (entries.some((entry) => entry.path === `/${prefix}-${index}`)) index += 1
  return `/${prefix}-${index}`
}

export const createMockResponse = (kind: MockResponse['kind'] = 'json'): MockResponse => {
  const base = { status: 200, headers: {}, delayMs: 0 }
  if (kind === 'generated')
    return {
      ...base,
      kind,
      schema: { name: 'person.fullName', email: 'internet.exampleEmail' },
      count: 1,
      locale: 'en',
    }
  return {
    ...base,
    kind,
    body: kind === 'json' ? '{\n  "message": "Hello from your mock API"\n}' : 'Hello from your mock API',
  }
}

export const createMockEndpoint = (path = '/example'): MockEndpoint => ({
  kind: 'endpoint',
  method: 'GET',
  path,
  response: createMockResponse(),
  scenarios: [],
})

export const createMockResource = (path = '/users'): MockResource => ({
  kind: 'resource',
  path,
  schema: { name: 'person.fullName', email: 'internet.exampleEmail', city: 'location.city' },
  count: 20,
  locale: 'en',
  headers: {},
  delayMs: 0,
  scenarios: [],
})

export const createMockScenario = (): MockScenario => ({
  name: 'Error response',
  conditions: [{ source: 'query', field: 'scenario', value: 'error' }],
  response: { kind: 'json', body: '{\n  "message": "Service unavailable"\n}', status: 503, headers: {}, delayMs: 0 },
})

export const createMockDefinition = (): MockDefinition => ({
  version: 1,
  seed: freshMockSeed(),
  referenceDate: new Date().toISOString(),
  entries: [createMockResource()],
})

export const shellQuote = (value: string): string => `'${value.replaceAll("'", "'\\''")}'`

export const requestExamples = (url: string, method: string, body: string, headers: Record<string, string>) => {
  const hasBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && body.trim().length > 0
  const requestHeaders = {
    ...headers,
    ...(hasBody && !Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')
      ? { 'Content-Type': 'application/json' }
      : {}),
  }
  return {
    curl: [
      `curl -X ${method} ${shellQuote(url)}`,
      ...Object.entries(requestHeaders).map(([key, value]) => `  -H ${shellQuote(`${key}: ${value}`)}`),
      ...(hasBody ? [`  --data-raw ${shellQuote(body)}`] : []),
    ].join(' \\\n'),
    fetch: `const response = await fetch(${JSON.stringify(url)}, ${JSON.stringify({ method, ...(Object.keys(requestHeaders).length ? { headers: requestHeaders } : {}), ...(hasBody ? { body } : {}) }, null, 2)});\nconsole.log(response.status, await response.text());`,
  }
}
