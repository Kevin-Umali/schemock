import { STORAGE_INVALID_MESSAGE, STORAGE_SAVE_FAILED_MESSAGE, STORAGE_UNAVAILABLE_MESSAGE } from '@/constants/storage'
import type { LocalStorageInitializer, StorageReadResult } from '@/types/local-storage'

export const resolveInitialValue = <T>(initializer: LocalStorageInitializer<T>, stored: T | undefined): T =>
  typeof initializer === 'function'
    ? (initializer as (stored: T | undefined) => T)(stored)
    : stored !== undefined
      ? stored
      : initializer

export const resolveStoredValue = <T>(initializer: LocalStorageInitializer<T>, stored: T | undefined): T =>
  stored === undefined ? resolveInitialValue(initializer, undefined) : stored

export const readStorageValue = <T>(key: string, validate?: (value: unknown) => value is T): StorageReadResult<T> => {
  if (typeof window === 'undefined') return { error: STORAGE_UNAVAILABLE_MESSAGE }

  let stored: string | null
  try {
    stored = window.localStorage.getItem(key)
  } catch {
    return { error: STORAGE_UNAVAILABLE_MESSAGE }
  }
  if (stored === null) return { error: null }

  let value: unknown
  try {
    value = JSON.parse(stored)
  } catch {
    return { error: STORAGE_INVALID_MESSAGE }
  }
  if (validate && !validate(value)) return { error: STORAGE_INVALID_MESSAGE }
  return { value: value as T, error: null }
}

export const writeStorageValue = (key: string, value: unknown): string | null => {
  if (typeof window === 'undefined') return STORAGE_UNAVAILABLE_MESSAGE

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return null
  } catch {
    return STORAGE_SAVE_FAILED_MESSAGE
  }
}

export const removeStorageValue = (key: string): string | null => {
  if (typeof window === 'undefined') return STORAGE_UNAVAILABLE_MESSAGE

  try {
    window.localStorage.removeItem(key)
    return null
  } catch {
    return STORAGE_SAVE_FAILED_MESSAGE
  }
}
