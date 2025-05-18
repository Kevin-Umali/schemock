import { hc } from 'hono/client'
import { type HonoAppType } from '@server/app'

// Create the client with proper typing
const client = hc<HonoAppType>('/')

// Create a type-safe API object
// @ts-ignore - Hono client typing issue
export const api = client.api.v1
