import { decodeSharedSchema } from '@/utils/schema'
import { templates } from '../constants/templates'
import type { GeneratorSearchState } from '../types/search-state'
import { isSettings } from './settings'
import type { GeneratorSettings } from '../types/settings'

export const defaultSettings = (): GeneratorSettings => ({
  schema: structuredClone(templates[0].schema),
  count: 10,
  locale: 'en',
  tableName: 'users',
  multiRowInsert: true,
  flatten: true,
})

export const initialSettings = (
  stored: unknown,
  search: GeneratorSearchState,
): { settings: GeneratorSettings; warning: string } => {
  let settings = isSettings(stored) ? structuredClone(stored) : defaultSettings()
  let warning = ''

  if (search.s) {
    try {
      settings = { ...settings, schema: decodeSharedSchema(search.s) }
    } catch (error) {
      warning = (error as Error).message
    }
  }

  if (search.c !== null) {
    const count = Number(search.c)
    if (Number.isFinite(count)) settings.count = count
  }

  if (search.l !== null) settings.locale = search.l
  if (search.t !== null) settings.tableName = search.t
  if (search.m !== null) settings.multiRowInsert = search.m === 'true' || search.m === '1'
  if (search.f !== null) settings.flatten = search.f === 'true' || search.f === '1'

  return { settings, warning }
}
