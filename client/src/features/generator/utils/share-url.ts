import type { GeneratorSettings } from '../types/settings'
import LZString from 'lz-string'

export const createGeneratorShareUrl = (currentUrl: string, settings: GeneratorSettings): string => {
  const url = new URL(currentUrl)
  const params = new URLSearchParams({
    s: LZString.compressToEncodedURIComponent(JSON.stringify(settings.schema)),
    c: String(settings.count),
    l: settings.locale,
    t: settings.tableName,
    m: String(settings.multiRowInsert),
    f: String(settings.flatten),
  })
  url.search = params.toString()
  return url.href
}
