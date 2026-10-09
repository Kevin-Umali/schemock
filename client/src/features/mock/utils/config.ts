import { MOCK_DEFAULTS, MOCK_PAGE_SIZES } from '../constants/config'
import { parseSchema } from '@/utils/schema'
import { peopleSchema } from '@/constants/sample-schemas'
import type { SelectOption } from '@/types/ui'
import { localeLabel } from '@/utils/locale'
import type { MockConfiguration } from '../types/config'

export const readMockConfiguration = (search: string): MockConfiguration => {
  const query = new URLSearchParams(search)
  let schema = peopleSchema
  try {
    const sharedSchema = query.get('s')
    if (sharedSchema) schema = parseSchema(sharedSchema)
  } catch {
    // An invalid shared schema falls back to the working example.
  }
  return {
    schema,
    count: Math.min(100, Math.max(1, Number(query.get('c')) || MOCK_DEFAULTS.count)),
    locale: query.get('l') || MOCK_DEFAULTS.locale,
    page: Math.max(1, Number(query.get('p')) || MOCK_DEFAULTS.page),
    limit: Math.min(20, Math.max(1, Number(query.get('lim')) || MOCK_DEFAULTS.limit)),
    sort: query.get('sort') || MOCK_DEFAULTS.sort,
  }
}

export const createMockShareUrl = (href: string, configuration: MockConfiguration): string => {
  const url = new URL(href)
  url.search = new URLSearchParams({
    s: JSON.stringify(configuration.schema),
    c: String(configuration.count),
    l: configuration.locale,
    p: String(configuration.page),
    lim: String(configuration.limit),
    sort: configuration.sort,
  }).toString()
  return url.href
}

export const getMockLocaleOptions = (locales: string[]): SelectOption[] =>
  locales.map((locale) => ({
    value: locale,
    label: localeLabel(locale),
  }))

export const getMockPageSizeOptions = (): SelectOption[] =>
  MOCK_PAGE_SIZES.map((size) => ({
    value: String(size),
    label: String(size),
  }))
