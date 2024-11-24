import { hc } from 'hono/client'
import { type HonoAppType } from '@server/app'

export const client = hc<HonoAppType>('/')

export const api = client.api.v1
