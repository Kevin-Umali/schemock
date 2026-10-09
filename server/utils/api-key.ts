import { API_KEY_PROTECTED_PATHS, API_KEY_TOKEN_PATTERN } from '../constant/api-auth'

export const requiresApiKey = (method: string, path: string): boolean =>
  method === 'POST' && API_KEY_PROTECTED_PATHS.has(path.replace(/\/+$/, '') || '/')

export const isValidBearerHeader = (value: string): boolean => {
  const match = /^Bearer +(.+)$/i.exec(value)
  return Boolean(match && API_KEY_TOKEN_PATTERN.test(match[1]))
}
