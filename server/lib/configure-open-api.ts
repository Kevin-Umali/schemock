import { apiReference } from '@scalar/hono-api-reference'
import { z } from '@hono/zod-openapi'
import type { HonoOpenAPI } from './types'
import { FakerMethods, Locales } from '../constant'
import { config } from '../config'
/**
 * Configures OpenAPI documentation for the application
 * @param app - Hono app instance
 * @returns The app with OpenAPI configured
 */
const configureOpenAPI = (app: HonoOpenAPI) => {
  app.doc('/api/v1/doc', {
    info: {
      title: config.app.name,
      version: config.app.version,
      description:
        'Generate synthetic data from a schema, export JSON, CSV, or SQL, and call public mock APIs defined in a URL. [Read the user guide](/docs).',
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    openapi: '3.0.0',
    servers: [
      {
        url: '/',
        description: 'API server',
      },
    ],
    tags: [
      {
        name: 'Generators',
        description: 'Generate records and templates in JSON, CSV, or SQL.',
      },
      {
        name: 'Mock API',
        description: 'Configure public endpoints, response scenarios, and stateless CRUD resources.',
      },
      {
        name: 'Reference',
        description: 'Find available generators and locales.',
      },
    ],
  })
  app.openAPIRegistry.registerComponent('schemas', 'FakerMethods', {
    type: 'string',
    enum: FakerMethods.options,
    example: 'person.fullName',
    description: 'Enumeration of Faker.js methods for generating mock data.',
  })
  app.openAPIRegistry.registerComponent('schemas', 'Locales', {
    type: 'string',
    enum: Locales.options,
    example: 'en',
    description: 'Enumeration of supported locales for generating mock data.',
  })
  for (const method of ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] as const) {
    for (const hasRoute of [false, true]) {
      app.openAPIRegistry.registerPath({
        method,
        path: hasRoute ? '/api/v1/mock/run/{definition}/{route}' : '/api/v1/mock/run/{definition}',
        summary: 'Run a URL-defined mock API',
        description:
          'Serve a stateless mock endpoint or generated collection from a gzip compressed, base64url definition in the URL. The route suffix may contain multiple path segments; omit it to call a configured root route.',
        tags: ['Mock API'],
        request: {
          params: hasRoute
            ? z.object({ definition: z.string(), route: z.string() })
            : z.object({ definition: z.string() }),
        },
        responses: {
          200: { description: 'Configured mock response.' },
          400: { description: 'Invalid mock definition or request body.' },
          404: { description: 'No matching mock route or resource item.' },
          405: { description: 'Path exists for a different method.' },
        },
      })
    }
  }
  app.get(
    '/api/v1/ui',
    apiReference({
      theme: 'none',
      pageTitle: config.app.name,
      url: '/api/v1/doc',
      documentDownloadType: 'none',
      layout: 'modern',
      showSidebar: true,
      darkMode: false,
      hideDarkModeToggle: false,
      searchHotKey: 'k',
      agent: { disabled: true },
      mcp: { disabled: true },
      showDeveloperTools: 'never',
      hideClientButton: true,
      customCss: `
          body {
            --scalar-font: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          .light-mode {
            --scalar-color-1: #171717;
            --scalar-color-2: #525252;
            --scalar-color-3: #737373;
            --scalar-color-accent: #262626;
            --scalar-color-green: #525252;
            --scalar-color-blue: #525252;
            --scalar-color-red: #525252;
            --scalar-color-orange: #525252;
            --scalar-color-yellow: #525252;
            --scalar-background-1: #fafafa;
            --scalar-background-2: #f5f5f5;
            --scalar-background-3: #e5e5e5;
            --scalar-background-accent: #f5f5f5;
            --scalar-border-color: rgb(0 0 0 / 10%);
          }
          .dark-mode {
            --scalar-color-1: #fafafa;
            --scalar-color-2: #a3a3a3;
            --scalar-color-3: #737373;
            --scalar-color-accent: #e5e5e5;
            --scalar-color-green: #a3a3a3;
            --scalar-color-blue: #a3a3a3;
            --scalar-color-red: #a3a3a3;
            --scalar-color-orange: #a3a3a3;
            --scalar-color-yellow: #a3a3a3;
            --scalar-background-1: #171717;
            --scalar-background-2: #262626;
            --scalar-background-3: #404040;
            --scalar-background-accent: rgb(255 255 255 / 8%);
            --scalar-border-color: rgb(255 255 255 / 12%);
          }
        `,
      metaData: {
        title: config.app.name,
        description: `${config.app.name} Documentation`,
      },
      withDefaultFonts: false,
    }),
  )
  return app
}
export default configureOpenAPI
