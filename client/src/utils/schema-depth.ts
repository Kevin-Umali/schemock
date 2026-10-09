import { SCHEMA_LIMITS } from '@/constants/schema-editor'

export const assertSchemaDepth = (depth: number, path: string): void => {
  if (depth > SCHEMA_LIMITS.depth) throw new Error(`Nesting at ${path} exceeds the ${SCHEMA_LIMITS.depth}-level limit.`)
}
