import { useRef, useMemo } from 'react'
import { useUnmount } from './useUnmount' // Adjust the import path accordingly

export interface CallOptions {
  leading?: boolean
  trailing?: boolean
}

export interface Options extends CallOptions {
  maxWait?: number
  debounceOnServer?: boolean
}

export interface ControlFunctions<ReturnT> {
  cancel: () => void
  flush: () => ReturnT | undefined
  isPending: () => boolean
}

export interface DebouncedState<T extends (...args: any) => ReturnType<T>> extends ControlFunctions<ReturnType<T>> {
  (...args: Parameters<T>): ReturnType<T> | undefined
}

export default function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(func: T, wait: number = 0, options: Options = {}): DebouncedState<T> {
  const lastCallTime = useRef<number | null>(null)
  const lastInvokeTime = useRef<number>(0)
  const timerId = useRef<number | null>(null)
  const lastArgs = useRef<Parameters<T> | null>(null)
  const lastThis = useRef<unknown>(null)
  const result = useRef<ReturnType<T> | undefined>(undefined)
  const funcRef = useRef(func)

  const isClientSide = typeof window !== 'undefined'
  const useRAF = !wait && isClientSide

  funcRef.current = func

  const leading = !!options.leading
  const trailing = options.trailing !== false
  const maxing = options.maxWait != null
  const maxWait = maxing ? Math.max(options.maxWait!, wait) : null
  const debounceOnServer = !!options.debounceOnServer

  // Cleanup on unmount
  useUnmount(() => {
    if (timerId.current !== null) {
      if (useRAF) {
        cancelAnimationFrame(timerId.current)
      } else {
        clearTimeout(timerId.current)
      }
      timerId.current = null
    }
  })

  const debounced = useMemo(() => {
    const invokeFunc = (time: number): ReturnType<T> => {
      const args = lastArgs.current!
      const thisArg = lastThis.current
      lastArgs.current = null
      lastThis.current = null
      lastInvokeTime.current = time
      return (result.current = funcRef.current.apply(thisArg, args))
    }

    const startTimer = (pendingFunc: () => void, waitTime: number) => {
      if (useRAF && timerId.current !== null) {
        cancelAnimationFrame(timerId.current)
      }
      timerId.current = useRAF ? requestAnimationFrame(pendingFunc) : window.setTimeout(pendingFunc, waitTime)
    }

    const shouldInvoke = (time: number): boolean => {
      if (lastCallTime.current === null) {
        return true
      }
      const timeSinceLastCall = time - lastCallTime.current
      const timeSinceLastInvoke = time - lastInvokeTime.current

      return timeSinceLastCall >= wait || timeSinceLastCall < 0 || (maxing && timeSinceLastInvoke >= (maxWait as number))
    }

    const trailingEdge = (time: number): ReturnType<T> | undefined => {
      timerId.current = null
      if (trailing && lastArgs.current) {
        return invokeFunc(time)
      }
      lastArgs.current = null
      lastThis.current = null
      return result.current
    }

    const timerExpired = () => {
      const time = Date.now()
      if (shouldInvoke(time)) {
        return trailingEdge(time)
      }
      if (timerId.current !== null) {
        const timeSinceLastCall = time - (lastCallTime.current as number)
        const timeSinceLastInvoke = time - lastInvokeTime.current
        const timeWaiting = wait - timeSinceLastCall
        const remainingWait = maxing ? Math.min(timeWaiting, (maxWait as number) - timeSinceLastInvoke) : timeWaiting
        startTimer(timerExpired, remainingWait)
      }
    }

    const debouncedFunction = (...args: Parameters<T>): ReturnType<T> | undefined => {
      if (!isClientSide && !debounceOnServer) {
        return
      }

      const time = Date.now()
      const isInvoking = shouldInvoke(time)

      lastArgs.current = args
      lastThis.current = undefined // 'this' is not used in functional components
      lastCallTime.current = time

      if (isInvoking) {
        if (timerId.current === null) {
          lastInvokeTime.current = lastCallTime.current
          startTimer(timerExpired, wait)
          if (leading) {
            return invokeFunc(lastCallTime.current)
          }
        } else if (maxing) {
          startTimer(timerExpired, wait)
          return invokeFunc(lastCallTime.current)
        }
      }

      if (timerId.current === null) {
        startTimer(timerExpired, wait)
      }

      return result.current
    }

    debouncedFunction.cancel = () => {
      if (timerId.current !== null) {
        if (useRAF) {
          cancelAnimationFrame(timerId.current)
        } else {
          clearTimeout(timerId.current)
        }
        timerId.current = null
      }
      lastInvokeTime.current = 0
      lastArgs.current = null
      lastCallTime.current = null
      lastThis.current = null
      result.current = undefined
    }

    debouncedFunction.isPending = (): boolean => {
      return timerId.current !== null
    }

    debouncedFunction.flush = (): ReturnType<T> | undefined => {
      if (timerId.current === null) {
        return result.current
      }
      return trailingEdge(Date.now())
    }

    return debouncedFunction
  }, [leading, trailing, wait, maxing, maxWait, useRAF, isClientSide, debounceOnServer])

  return debounced
}
