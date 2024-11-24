import { useRef, useState, useEffect } from 'react'
import useDebouncedCallback, { DebouncedState } from './useDebounceCallback'

type UseDebounceValueOptions<T> = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
  equalityFn?: (left: T, right: T) => boolean
}

export function useDebounceValue<T>(initialValue: T | (() => T), delay: number, options?: UseDebounceValueOptions<T>): [T, DebouncedState<(value: T) => void>] {
  const { equalityFn = (left: T, right: T) => left === right, ...debounceOptions } = options || {}
  const unwrappedInitialValue = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
  const [debouncedValue, setDebouncedValue] = useState<T>(unwrappedInitialValue)
  const previousValueRef = useRef<T>(unwrappedInitialValue)

  const updateDebouncedValue = useDebouncedCallback<(value: T) => void>(
    (value: T) => {
      setDebouncedValue(value)
    },
    delay,
    debounceOptions,
  )

  useEffect(() => {
    if (!equalityFn(previousValueRef.current, unwrappedInitialValue)) {
      updateDebouncedValue(unwrappedInitialValue)
      previousValueRef.current = unwrappedInitialValue
    }
  }, [unwrappedInitialValue, equalityFn, updateDebouncedValue])

  return [debouncedValue, updateDebouncedValue]
}
