import { useLocalStorage } from '@/hooks/use-local-storage'
import { LIBRARY_KEY } from '../constants/storage'
import type { SavedSchema } from '../types/settings'
import { isSavedSchemaList } from '../services/schema-storage'

export const useSavedSchemas = () => {
  const storage = useLocalStorage<SavedSchema[]>(LIBRARY_KEY, [], isSavedSchemaList)

  return {
    entries: storage.value,
    error: storage.error,
    reload: storage.reload,
    save: storage.setValue,
  }
}
