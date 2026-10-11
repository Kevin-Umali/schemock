import { MOCK_DEFAULTS } from '../constants/config'
import { parseSchema } from '@/utils/schema'
import { peopleSchema } from '@/constants/sample-schemas'
import type { MockConfiguration } from '../types/config'

export const readMockConfiguration = (search: string): MockConfiguration => {
  const query = new URLSearchParams(search)
  let schema = peopleSchema
  try {
    const sharedSchema = query.get('s')
    if (sharedSchema) schema = parseSchema(sharedSchema)
  } catch {
    // An invalid shared schema falls back to the working example.
  }
  return {
    schema,
    count: Math.min(100, Math.max(1, Number(query.get('c')) || MOCK_DEFAULTS.count)),
    locale: query.get('l') || MOCK_DEFAULTS.locale,
    page: Math.max(1, Number(query.get('p')) || MOCK_DEFAULTS.page),
    limit: Math.min(20, Math.max(1, Number(query.get('lim')) || MOCK_DEFAULTS.limit)),
    sort: query.get('sort') || MOCK_DEFAULTS.sort,
  }
}
