import type { FakerMethodCategory } from '@/types/faker'
import type { SelectOption } from '@/types/ui'
import { ALL_METHOD_CATEGORIES } from '../constants/config'

export const getMethodCategoryOptions = (groups: FakerMethodCategory[]): SelectOption[] => [
  { value: ALL_METHOD_CATEGORIES, label: 'All categories' },
  ...groups.map(({ category }) => ({ value: category, label: category })),
]

export const filterMethodCategories = (
  groups: FakerMethodCategory[],
  search: string,
  category: string,
): FakerMethodCategory[] => {
  const term = search.trim().toLocaleLowerCase()
  return groups
    .filter((group) => category === ALL_METHOD_CATEGORIES || group.category === category)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => `${item.method} ${item.description}`.toLocaleLowerCase().includes(term)),
    }))
    .filter((group) => group.items.length > 0)
}
