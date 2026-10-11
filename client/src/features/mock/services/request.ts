import type { MockTestRequest, MockTestResult } from '../types/api'

export const requestMock = async ({ url, method, path, body, headers }: MockTestRequest): Promise<MockTestResult> => {
  const start = performance.now()
  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method) && Boolean(body.trim())
  const requestHeaders = new Headers(headers)
  if (hasBody && !requestHeaders.has('Content-Type')) requestHeaders.set('Content-Type', 'application/json')
  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    ...(hasBody ? { body } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  const text = await response.text()
  let formatted = text
  try {
    formatted = JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    /* Preserve text and empty responses. */
  }
  return {
    method,
    path,
    status: response.status,
    duration: Math.round(performance.now() - start),
    body: formatted,
    headers: Object.fromEntries(response.headers),
  }
}
