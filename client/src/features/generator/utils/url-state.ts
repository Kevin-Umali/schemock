import type { GeneratorSearchState } from '../types/search-state'
import type { GeneratorSettings } from '../types/settings'
import { initialSettings } from './initial-settings'

export const getSearchSnapshot = (search: GeneratorSearchState): string => JSON.stringify(search)

export const settingsToSearch = (settings: GeneratorSettings) => ({
  c: String(settings.count),
  l: settings.locale,
  t: settings.tableName,
  m: String(settings.multiRowInsert),
  f: String(settings.flatten),
})

export const applySearch = (
  baseline: GeneratorSettings,
  currentSchema: GeneratorSettings['schema'],
  search: GeneratorSearchState,
): GeneratorSettings => {
  const next = initialSettings(baseline, search).settings
  if (!search.s) next.schema = structuredClone(currentSchema)
  return next
}
