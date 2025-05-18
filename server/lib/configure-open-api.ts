import { apiReference } from '@scalar/hono-api-reference'
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
      description: config.app.description,
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
        name: 'Generate Routes',
        description: 'Endpoints for generating mock data in various formats (e.g., JSON, CSV, SQL, etc.).',
      },
      {
        name: 'Mock Routes',
        description: 'Endpoints for simulating API responses, including paginated data.',
      },
      {
        name: 'Helper Routes',
        description: 'Utility endpoints to assist with data generation, such as fetching available options for enums.',
      },
    ],
  })

  app.openAPIRegistry.registerComponent('schemas', 'FakerMethods', {
    type: 'string',
    enum: FakerMethods.options,
    example: {
      schema: {
        firstName: 'person.firstName',
      },
      count: 1,
      locale: 'en',
    },
    description: 'Enumeration of Faker.js methods for generating mock data.',
  })
  app.openAPIRegistry.registerComponent('schemas', 'Locales', {
    type: 'string',
    enum: Locales.options,
    example: {
      schema: {},
      count: 1,
      locale: 'ja',
    },
    description: 'Enumeration of supported locales for generating mock data.',
  })

  app.get(
    '/api/v1/ui',
    apiReference({
      theme: 'alternate',
      pageTitle: config.app.name,
      spec: {
        url: '/api/v1/doc',
      },
      hideDownloadButton: true,
      layout: 'modern',
      showSidebar: true,
      searchHotKey: 'k',
      metaData: {
        title: config.app.name,
        description: `${config.app.name} Documentation`,
      },
      withDefaultFonts: true,
    }),
  )

  return app
}

export default configureOpenAPI
