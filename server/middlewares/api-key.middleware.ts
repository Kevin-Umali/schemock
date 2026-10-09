import { bearerAuth } from 'hono/bearer-auth'
import { createMiddleware } from 'hono/factory'
import { config } from '../config'
import { API_KEY_AUTH_MESSAGE, API_KEY_AUTH_REALM, API_KEY_TOKEN_PATTERN } from '../constant/api-auth'
import { isValidBearerHeader, requiresApiKey } from '../utils/api-key'

const configuredApiKey = config.apiKey

if (configuredApiKey && !API_KEY_TOKEN_PATTERN.test(configuredApiKey)) {
  throw new Error('SCHEMOCK_API_KEY must use valid HTTP bearer token characters.')
}

const validateBearerToken = configuredApiKey
  ? bearerAuth({
      token: configuredApiKey,
      realm: API_KEY_AUTH_REALM,
      noAuthenticationHeader: { message: { message: API_KEY_AUTH_MESSAGE } },
      invalidToken: { message: { message: API_KEY_AUTH_MESSAGE } },
    })
  : null

export const apiKeyAuth = createMiddleware(async (c, next) => {
  if (!validateBearerToken || !requiresApiKey(c.req.method, c.req.path)) return next()

  const authorization = c.req.header('Authorization')
  if (authorization && !isValidBearerHeader(authorization)) {
    return c.json({ message: API_KEY_AUTH_MESSAGE }, 401, {
      'WWW-Authenticate': `Bearer realm="${API_KEY_AUTH_REALM}"`,
    })
  }

  return validateBearerToken(c, next)
})
