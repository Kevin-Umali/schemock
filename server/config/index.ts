import { positiveInteger } from '../utils/env'
// Configuration settings for the application
import packageJSON from '../../package.json' with { type: 'json' }
export const config = {
  apiKey: process.env.SCHEMOCK_API_KEY || undefined,
  app: {
    name: 'Schemock API',
    version: packageJSON.version,
    description:
      'Schemock is a schema-based data generator for APIs. It allows developers to generate mock data based on defined schemas, aiding in API development and testing.',
    port: positiveInteger(process.env.PORT, 3000),
  },
  cache: {
    name: 'schemock-cache',
    ttl: {
      short: 60, // 1 minute
      medium: 300, // 5 minutes
      long: 3600, // 1 hour
    },
  },
  cors: {
    origin:
      process.env.CORS_ORIGINS?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) || '*',
    allowHeaders: ['Authorization', 'Content-Type', 'X-Flatten-Objects', 'X-Format-Objects'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision', 'Retry-After', 'RateLimit', 'RateLimit-Policy'],
    maxAge: 600,
    credentials: false,
  },
  rateLimit: {
    windowMs: positiveInteger(process.env.API_RATE_WINDOW_MS, 60_000),
    limit: positiveInteger(process.env.API_RATE_LIMIT, 120),
    bulkLimit: positiveInteger(process.env.API_BULK_RATE_LIMIT, 20),
    standardHeaders: true,
  },
  timeout: 60000, // 60 seconds
}
