import type * as React from 'react'

export type LocalStorageInitializer<T> = T | ((stored: T | undefined) => T)

export type LocalStorageSetter<T> = (next: React.SetStateAction<T>) => string | null

export interface LocalStorageState<T> {
  value: T
  setValue: LocalStorageSetter<T>
  error: string | null
  clearError: () => void
  reload: () => void
}
export interface StorageReadResult<T> {
  value?: T
  error: string | null
}
