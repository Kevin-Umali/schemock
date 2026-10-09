import type { Theme } from '@/types/theme'

export const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark'

export const applyTheme = (theme: Theme): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}
