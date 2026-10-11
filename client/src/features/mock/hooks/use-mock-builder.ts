import { useCallback, useEffect, useMemo, useState } from 'react'
import { parseAsString, useQueryState } from 'nuqs'
import { absoluteApiUrl } from '@/utils/api-url'
import { decodeMockDefinition, encodeMockDefinition } from '../services/definition-codec'
import type { MockDefinition, MockEntry } from '../types/definition'
import { createMockDefinition, freshMockSeed } from '../utils/builder'
import { readMockConfiguration } from '../utils/config'

const initialDefinition = (): MockDefinition => {
  const definition = createMockDefinition()
  if (!new URLSearchParams(window.location.search).has('s')) return definition
  const legacy = readMockConfiguration(window.location.search)
  return {
    ...definition,
    entries: [
      {
        kind: 'endpoint',
        method: 'GET',
        path: '/records',
        response: {
          kind: 'generated',
          schema: legacy.schema,
          count: legacy.count,
          locale: legacy.locale,
          paginated: true,
          pagination: {
            page: legacy.page,
            limit: legacy.limit,
            ...(legacy.sort ? { sort: legacy.sort } : {}),
          },
          status: 200,
          headers: {},
          delayMs: 0,
        },
        scenarios: [],
      },
    ],
  }
}

export const useMockBuilder = () => {
  const [sharedToken] = useQueryState('m', parseAsString)
  const [definition, setDefinition] = useState(initialDefinition)
  const [selected, setSelected] = useState(0)
  const [loadedToken, setLoadedToken] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [issues, setIssues] = useState<Record<string, string>>({})
  const [encoded, setEncoded] = useState({ token: '', snapshot: '' })
  const [encodingError, setEncodingError] = useState('')
  const snapshot = useMemo(() => JSON.stringify(definition), [definition])

  useEffect(() => {
    if (!sharedToken) return
    let cancelled = false
    void decodeMockDefinition(sharedToken)
      .then((value) => {
        if (cancelled) return
        setDefinition(value)
        setSelected(0)
        setIssues({})
        setNotice('Shared mock loaded. Copy a new link after editing.')
      })
      .catch((error: Error) => {
        if (!cancelled) setNotice(`${error.message} A new example is shown below.`)
      })
      .finally(() => {
        if (!cancelled) setLoadedToken(sharedToken)
      })
    return () => {
      cancelled = true
    }
  }, [sharedToken])

  useEffect(() => {
    let cancelled = false
    void encodeMockDefinition(definition)
      .then((token) => {
        if (!cancelled) {
          setEncoded({ token, snapshot })
          setEncodingError('')
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setEncoded({ token: '', snapshot })
          setEncodingError(error.message)
        }
      })
    return () => {
      cancelled = true
    }
  }, [definition, snapshot])

  const reportIssue = useCallback((id: string, message: string) => {
    setIssues((current) => (current[id] === message ? current : { ...current, [id]: message }))
  }, [])
  const updateEntry = (entry: MockEntry) =>
    setDefinition((current) => ({
      ...current,
      entries: current.entries.map((value, index) => (index === selected ? entry : value)),
    }))
  const addEntry = (entry: MockEntry) => {
    setSelected(definition.entries.length)
    setIssues({})
    setDefinition((current) => ({ ...current, entries: [...current.entries, entry] }))
  }
  const removeEntry = () => {
    setDefinition((current) => ({ ...current, entries: current.entries.filter((_, index) => index !== selected) }))
    setSelected(Math.max(0, selected - 1))
    setIssues({})
  }
  const selectEntry = (index: number) => {
    if (Object.values(issues).some(Boolean)) {
      setNotice('Finish the highlighted edits before selecting another endpoint.')
      return
    }
    setSelected(index)
    setIssues({})
  }
  const token = encoded.snapshot === snapshot ? encoded.token : ''
  const loading = Boolean(sharedToken && loadedToken !== sharedToken)
  const error = Object.values(issues).find(Boolean) || encodingError
  const ready = Boolean(token) && definition.entries.length > 0 && !error && !loading
  const baseUrl = token ? absoluteApiUrl(`/mock/run/${token}`) : ''
  const shareUrl = token ? new URL(`/mock?${new URLSearchParams({ m: token })}`, window.location.origin).href : ''
  return {
    definition,
    selected,
    entry: definition.entries[selected],
    loading,
    notice,
    setNotice,
    error,
    ready,
    baseUrl,
    shareUrl,
    updateEntry,
    addEntry,
    removeEntry,
    selectEntry,
    reportIssue,
    clearScenarioIssues: () =>
      setIssues((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !id.startsWith('scenario-')))),
    regenerate: () => {
      setDefinition((current) => ({ ...current, seed: freshMockSeed() }))
      setNotice('Data regenerated. Copy a new URL to use this dataset.')
    },
  }
}
