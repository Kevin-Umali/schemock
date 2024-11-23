import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'

export type HonoOpenAPI = OpenAPIHono

export type HonoRouteHandler<R extends RouteConfig> = RouteHandler<R>
