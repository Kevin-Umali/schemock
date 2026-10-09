import type { SavedSchema } from '../types/settings'
import type { OutputFormat } from '@/types/schema'
import { isObject } from '@/utils/schema'
import { isSettings } from '../utils/settings'

export const draftKey = (format: OutputFormat): string => `schemock:draft:v1:${format}`

export const isSavedSchema = (value: unknown): value is SavedSchema =>
  isSettings(value) &&
  isObject(value) &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  typeof value.updatedAt === 'string'

export const isSavedSchemaList = (value: unknown): value is SavedSchema[] =>
  Array.isArray(value) && value.every(isSavedSchema)
