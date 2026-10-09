const languages = new Intl.DisplayNames(['en'], { type: 'language' })
export const localeLabel = (locale: string): string => {
  if (locale === 'base') return 'Base defaults (base)'
  try {
    return `${languages.of(locale.replaceAll('_', '-')) ?? locale} (${locale})`
  } catch {
    return locale
  }
}
