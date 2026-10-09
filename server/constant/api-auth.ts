export const API_KEY_TOKEN_PATTERN = /^[A-Za-z0-9._~+/-]+=*$/
export const API_KEY_AUTH_REALM = 'Schemock API'
export const API_KEY_AUTH_MESSAGE =
  'A valid bearer token is required. Use an authorized API client or the API reference.'
export const BEARER_SECURITY: ApiSecurityRequirement[] = [{ SchemockBearer: [] }]
export const OPTIONAL_BEARER_SECURITY: ApiSecurityRequirement[] = [{}, ...BEARER_SECURITY]
export const API_KEY_OPENAPI_DESCRIPTION =
  'When the server is configured with SCHEMOCK_API_KEY, include it as an Authorization: Bearer token. Authentication is optional when the variable is unset.'

export const API_KEY_PROTECTED_PATHS = new Set([
  '/api/v1/generate/json',
  '/api/v1/generate/csv',
  '/api/v1/generate/sql',
  '/api/v1/generate/template',
  '/api/v1/mock/pagination',
])
import type { ApiSecurityRequirement } from '../types/api-auth'
