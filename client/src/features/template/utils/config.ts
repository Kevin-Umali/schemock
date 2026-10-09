import LZString from 'lz-string'
import type { SelectOption } from '@/types/ui'
import { localeLabel } from '@/utils/locale'
import { DEFAULT_TEMPLATE } from '../constants/config'
import type { FakerMethodCategory } from '@/types/faker'

import type { TemplateConfiguration } from '../types/config'

export const readTemplateConfiguration = (search: string): TemplateConfiguration => {
  const query = new URLSearchParams(search)
  const compressed = query.get('t')
  return {
    template: compressed ? LZString.decompressFromEncodedURIComponent(compressed) || compressed : DEFAULT_TEMPLATE,
    count: Math.min(100, Math.max(1, Number(query.get('c')) || 1)),
    locale: query.get('l') || 'en',
    formatObjects: query.get('f') !== 'false',
  }
}

export const createTemplateShareUrl = (href: string, configuration: TemplateConfiguration): string => {
  const url = new URL(href)
  url.search = new URLSearchParams({
    t: LZString.compressToEncodedURIComponent(configuration.template),
    c: String(configuration.count),
    l: configuration.locale,
    f: String(configuration.formatObjects),
  }).toString()
  return url.href
}

export const getTemplateLocaleOptions = (locales: string[]): SelectOption[] =>
  locales.map((locale) => ({
    value: locale,
    label: localeLabel(locale),
  }))

export const getTemplateGeneratorOptions = (groups: FakerMethodCategory[]): SelectOption[] =>
  groups.flatMap((group) =>
    group.items.map((item) => ({
      value: item.method,
      label: item.method,
      description: item.description,
    })),
  )
