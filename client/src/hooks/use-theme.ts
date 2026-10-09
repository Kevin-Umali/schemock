import { THEME_STORAGE_KEY } from '@/constants/theme'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { Theme } from '@/types/theme'
import { isTheme, applyTheme } from '@/utils/theme'
import { useCallback, useEffect } from 'react'

export const useTheme = () => {
  const { value: theme, setValue } = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'light', isTheme)

  useEffect(() => applyTheme(theme), [theme])

  const toggleTheme = useCallback(() => {
    setValue((current) => current === 'light' ? 'dark' : 'light')
  }, [setValue])

  return { theme, toggleTheme }
}
