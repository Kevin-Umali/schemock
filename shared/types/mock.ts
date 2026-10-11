import type { MOCK_METHODS } from '../constants/mock'

export type MockMethod = (typeof MOCK_METHODS)[number]
export type MockSchemaValue = string | number | boolean | null | MockSchema | { items: MockSchemaValue; count: number }
export interface MockSchema {
  [key: string]: MockSchemaValue
}
export interface MockResponseBase {
  status: number
  headers: Record<string, string>
  delayMs: number
}
export interface MockPagination {
  page: number
  limit: number
  sort?: string
}
export type MockResponse = MockResponseBase &
  (
    | { kind: 'json'; body: string }
    | { kind: 'text'; body: string }
    | {
        kind: 'generated'
        schema: MockSchema
        count: number
        locale: string
        paginated?: boolean
        pagination?: MockPagination
      }
  )
export interface MockCondition {
  source: 'query' | 'header' | 'body'
  field: string
  value: string | number | boolean | null
}
export interface MockScenario {
  name: string
  method?: MockMethod
  conditions: MockCondition[]
  response: MockResponse
}
export interface MockEndpoint {
  kind: 'endpoint'
  method: MockMethod
  path: string
  response: MockResponse
  scenarios: MockScenario[]
}
export interface MockResource {
  kind: 'resource'
  path: string
  schema: MockSchema
  count: number
  locale: string
  headers: Record<string, string>
  delayMs: number
  scenarios: MockScenario[]
}
export type MockEntry = MockEndpoint | MockResource
export interface MockDefinition {
  version: 1
  seed: number
  referenceDate: string
  entries: MockEntry[]
}
