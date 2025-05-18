// Configuration settings for the application
import packageJSON from '../../package.json' with { type: 'json' }

export const config = {
  app: {
    name: 'Schemock API',
    version: packageJSON.version,
    description: 'Schemock is a schema-based data generator for APIs. It allows developers to generate mock data based on defined schemas, aiding in API development and testing.',
    port: 3000,
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
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requests per windowMs
    standardHeaders: true,
  },
  timeout: 60000, // 60 seconds
}
