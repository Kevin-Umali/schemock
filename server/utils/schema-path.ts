export const appendSchemaPath = (path: string, key: string): string =>
  /^[a-zA-Z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`
