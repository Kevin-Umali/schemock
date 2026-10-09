import { config } from '../config'
import type { ApiSecurityRequirement } from '../types/api-auth'
import { BEARER_SECURITY, OPTIONAL_BEARER_SECURITY } from '../constant/api-auth'

export const withOptionalBearerSecurity = <TRoute extends object>(
  route: TRoute,
): TRoute & {
  security: ApiSecurityRequirement[]
} => Object.assign(route, { security: config.apiKey ? BEARER_SECURITY : OPTIONAL_BEARER_SECURITY })
