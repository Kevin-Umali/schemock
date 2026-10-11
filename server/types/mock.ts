import type { MockEntry } from '../../shared/types/mock'

export interface RouteMatch {
  entry: MockEntry
  params: Record<string, string>
  specificity: number
  resourceTarget: 'collection' | 'item' | null
  resourceItemId?: string
}
