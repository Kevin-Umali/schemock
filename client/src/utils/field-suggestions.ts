import { commonMethods } from '@/constants/fields'
import { NAMED_GENERATORS } from '@/constants/schema-inference'
import type { FieldNameSuggestion } from '@/types/field-suggestions'
import type { FakerMethodCategory } from '@/types/faker'
import { normalizeFieldName } from '@/utils/field-name'

const getFieldName = (name: string): string => {
  const segments = name.split(/[.[\]]+/).filter(Boolean)
  return segments.at(-1) ?? name
}

const getMethodLabel = (method: string): string =>
  commonMethods.find(([candidate]) => candidate === method)?.[1] ?? method

export const getFieldNameSuggestions = (name: string, methods: FakerMethodCategory[]): FieldNameSuggestion[] => {
  const supportedMethods = new Set([
    ...commonMethods.map(([method]) => method),
    ...methods.flatMap((category) => category.items.map((item) => item.method)),
  ])
  const fieldName = getFieldName(name)
  const inferredMethod = NAMED_GENERATORS.find(([pattern]) => {
    pattern.lastIndex = 0
    return pattern.test(normalizeFieldName(fieldName))
  })?.[1]

  if (!inferredMethod || !supportedMethods.has(inferredMethod)) return []

  const suggestions: FieldNameSuggestion[] = [
    {
      method: inferredMethod,
      label: getMethodLabel(inferredMethod),
      reason: `Suggested for “${fieldName}”`,
    },
  ]

  return suggestions
}
