import { useLocalStorage } from '@/hooks/use-local-storage'
import { useMutation } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GENERATOR_SEARCH_PARAMS } from '../constants/search-params'
import { draftKey } from '../services/schema-storage'
import type { GeneratorSearchState } from '../types/search-state'
import type { GeneratorSettings } from '../types/settings'
import type { OutputFormat, Schema } from '@/types/schema'
import { requestData } from '../services/generate-data'
import { defaultSettings, initialSettings } from '../utils/initial-settings'
import { createGeneratorShareUrl } from '../utils/share-url'
import { isSettings } from '../utils/settings'
import { applySearch, getSearchSnapshot, settingsToSearch } from '../utils/url-state'

export const useGenerator = (format: OutputFormat) => {
  const [search, setSearch] = useQueryStates(GENERATOR_SEARCH_PARAMS, { history: 'push' })
  const [initialWarning] = useState(() => initialSettings(undefined, search).warning)
  const [notice, setNotice] = useState(initialWarning)
  const storage = useLocalStorage<GeneratorSettings>(
    draftKey(format),
    (stored) => {
      const base = isSettings(stored) ? stored : defaultSettings()
      return applySearch(base, base.schema, search)
    },
    isSettings,
  )
  const { value: settings, setValue: setSettings, error: storageError } = storage
  const baselineSettings = useRef(settings)
  const settingsRef = useRef(settings)
  const locallyWrittenSettings = useRef<GeneratorSettings | null>(null)
  const lastAppliedSearch = useRef(getSearchSnapshot(search))
  const requestedSearches = useRef(new Set<string>())
  const [revision, setRevision] = useState(0)
  const generation = useMutation({ mutationFn: (value: GeneratorSettings) => requestData(format, value) })

  const updateSearch = useCallback(
    (patch: Partial<GeneratorSearchState>, history: 'push' | 'replace') => {
      const next = { ...search, ...patch }
      const snapshot = getSearchSnapshot(next)
      if (snapshot === getSearchSnapshot(search)) return
      requestedSearches.current.add(snapshot)
      void setSearch(patch, { history })
    },
    [search, setSearch],
  )

  useEffect(() => {
    const snapshot = getSearchSnapshot(search)
    if (requestedSearches.current.delete(snapshot)) {
      lastAppliedSearch.current = snapshot
      return
    }
    if (snapshot === lastAppliedSearch.current) {
      if (search.s !== null) updateSearch({ s: null }, 'replace')
      return
    }

    lastAppliedSearch.current = snapshot
    const next = applySearch(baselineSettings.current, settingsRef.current.schema, search)
    settingsRef.current = next
    setSettings(next)
    setNotice(initialSettings(baselineSettings.current, search).warning)
    if (search.s !== null) updateSearch({ s: null }, 'replace')
  }, [search, setSettings, updateSearch])

  useEffect(() => {
    if (locallyWrittenSettings.current === settings) {
      locallyWrittenSettings.current = null
      return
    }
    settingsRef.current = settings
  }, [settings])

  const initialValue = useRef(settings)
  const initialValuePersisted = useRef(false)
  useEffect(() => {
    if (initialValuePersisted.current) return
    initialValuePersisted.current = true
    setSettings(initialValue.current)
  }, [setSettings])

  const updateSettings = useCallback(
    (patch: Partial<GeneratorSettings>) => {
      const next = { ...settingsRef.current, ...patch }
      settingsRef.current = next
      locallyWrittenSettings.current = next
      setSettings(next)
      if (Object.keys(patch).some((key) => key !== 'schema')) {
        updateSearch({ ...settingsToSearch(next), s: null }, 'push')
      } else if (search.s !== null) {
        updateSearch({ s: null }, 'replace')
      }
    },
    [search.s, setSettings, updateSearch],
  )

  const loadSettings = useCallback(
    (value: GeneratorSettings) => {
      settingsRef.current = value
      locallyWrittenSettings.current = value
      setSettings(value)
      updateSearch({ ...settingsToSearch(value), s: null }, 'push')
      setRevision((previous) => previous + 1)
      generation.reset()
    },
    [generation, setSettings, updateSearch],
  )

  const setSchema = useCallback((schema: Schema) => updateSettings({ schema }), [updateSettings])

  const shareUrl = useCallback(() => createGeneratorShareUrl(window.location.href, settings), [settings])

  return {
    settings,
    updateSettings,
    setSchema,
    loadSettings,
    revision,
    notice: storageError || notice,
    setNotice,
    generation,
    shareUrl,
    storageError,
  }
}
