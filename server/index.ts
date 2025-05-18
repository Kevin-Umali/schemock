import app from './app'
import { config } from './config'

/**
 * Bun server configuration
 * This is the entry point for the Bun server
 */
export default {
  port: config.app.port,
  fetch: app.fetch,
}
