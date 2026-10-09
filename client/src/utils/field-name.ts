export const normalizeFieldName = (name: string): string =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .trim()
    .toLowerCase()
