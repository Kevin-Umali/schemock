import type { SelectOption } from '@/types/ui'

export const getSelectedOption = (options: SelectOption[], value: string): SelectOption =>
  options.find((option) => option.value === value) ?? { value, label: value }
