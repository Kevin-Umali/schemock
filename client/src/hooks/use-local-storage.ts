import type { LocalStorageInitializer, LocalStorageState } from '@/types/local-storage'
import { LOCAL_STORAGE_SYNC_EVENT, STORAGE_INVALID_MESSAGE } from '@/constants/storage'
import { readStorageValue, resolveInitialValue, resolveStoredValue, writeStorageValue } from '@/utils/local-storage'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initializer: LocalStorageInitializer<T>,
  validate?: (value: unknown) => value is T,
): LocalStorageState<T> => {
  const [initialRead] = useState(() => readStorageValue<T>(key, validate))
  const [value, setValue] = useState<T>(() => resolveInitialValue(initializer, initialRead.value))
  const [error, setError] = useState<string | null>(initialRead.error)
  const valueRef = useRef(value)
  const keyRef = useRef(key)

  useEffect(() => {
    if (keyRef.current === key) return
    keyRef.current = key
    const result = readStorageValue<T>(key, validate)
    const nextValue = resolveInitialValue(initializer, result.value)
    valueRef.current = nextValue
    setValue(nextValue)
    setError(result.error)
  }, [initializer, key, validate])

  useEffect(() => {
    const applyExternalValue = (raw: unknown | undefined, error: string | null = null) => {
      if (raw !== undefined && validate && !validate(raw)) {
        setError(STORAGE_INVALID_MESSAGE)
        return
      }
      const nextValue = resolveStoredValue(initializer, raw as T | undefined)
      valueRef.current = nextValue
      setValue(nextValue)
      setError(error)
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== keyRef.current && event.key !== null) return
      const result =
        event.newValue === null ? { value: undefined, error: null } : readStorageValue<T>(keyRef.current, validate)
      applyExternalValue(result.value, result.error)
    }

    const handleSameTabStorage = (event: Event) => {
      const detail: unknown = (event as CustomEvent<unknown>).detail
      if (typeof detail !== 'object' || detail === null || !('key' in detail) || !('value' in detail)) return
      if (detail.key !== keyRef.current) return
      applyExternalValue(detail.value)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(LOCAL_STORAGE_SYNC_EVENT, handleSameTabStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(LOCAL_STORAGE_SYNC_EVENT, handleSameTabStorage)
    }
  }, [initializer, validate])

  const updateValue = useCallback<LocalStorageState<T>['setValue']>((next) => {
    const resolved = typeof next === 'function' ? (next as (current: T) => T)(valueRef.current) : next
    valueRef.current = resolved
    setValue(resolved)
    const saveError = writeStorageValue(keyRef.current, resolved)
    setError(saveError)
    if (!saveError && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_SYNC_EVENT, {
          detail: { key: keyRef.current, value: resolved },
        }),
      )
    }
    return saveError
  }, [])

  const clearError = useCallback(() => setError(null), [])
  const reload = useCallback(() => {
    const result = readStorageValue<T>(keyRef.current, validate)
    const nextValue = resolveStoredValue(initializer, result.value)
    valueRef.current = nextValue
    setValue(nextValue)
    setError(result.error)
  }, [initializer, validate])

  return { value, setValue: updateValue, error, clearError, reload }
}
