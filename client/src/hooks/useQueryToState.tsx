import { useCallback, useEffect, useRef, useState } from "react";
import qs from "qs";

type QueryValue = string | number | boolean | null;

interface QueryStateOptions<T> {
  history?: "push" | "replace";
  parse?: (value: string) => T;
  serialize?: (value: T) => string;
  equals?: (a: T, b: T) => boolean;
  defaultValue?: T;
  clearOnDefault?: boolean;
}

export function useQueryState<T extends QueryValue>(
  key: string,
  options: QueryStateOptions<T> = {}
): [T | null, (value: T | ((prev: T | null) => T) | null) => void] {
  const {
    history = "replace",
    parse = ((x: string) => x) as (x: string) => T,
    serialize = String,
    equals = (a, b) => a === b,
    defaultValue = null as T,
    clearOnDefault = true,
  } = options;

  const getQuery = useCallback(() => {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true });
  }, []);

  const getInitialValue = useCallback((): T | null => {
    const query = getQuery();
    const value = query[key] as string | undefined;

    if (value === undefined) return defaultValue;

    try {
      return parse(value);
    } catch (error) {
      console.error(`Error parsing value for key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, parse]);

  const [internalValue, setInternalValue] = useState<T | null>(getInitialValue);
  const valueRef = useRef(internalValue);
  const queryRef = useRef<string | null>(null);

  const updateUrl = useCallback(
    (newQuery: Record<string, unknown>) => {
      const search = qs.stringify(newQuery, { addQueryPrefix: true });
      const newUrl = `${window.location.pathname}${search}${window.location.hash}`;

      if (history === "push") {
        window.history.pushState(null, "", newUrl);
      } else {
        window.history.replaceState(null, "", newUrl);
      }
    },
    [history]
  );

  const setValue = useCallback(
    (newValueOrUpdater: T | ((prev: T | null) => T) | null) => {
      const query = getQuery();

      const newValue = typeof newValueOrUpdater === "function" ? (newValueOrUpdater as (prev: T | null) => T)(valueRef.current) : newValueOrUpdater;

      // Handle clearing or default value
      if (newValue === null || (clearOnDefault && defaultValue !== null && equals(newValue, defaultValue))) {
        delete query[key];
      } else {
        query[key] = serialize(newValue);
      }

      updateUrl(query);
      valueRef.current = newValue;
      queryRef.current = (query[key] as string) ?? null;
      setInternalValue(newValue);
    },
    [key, defaultValue, clearOnDefault, equals, serialize, updateUrl, getQuery]
  );

  // Sync with URL changes
  useEffect(() => {
    const handlePopState = () => {
      const newValue = getInitialValue();
      valueRef.current = newValue;
      setInternalValue(newValue);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getInitialValue]);

  return [internalValue, setValue];
}

export default useQueryState;
