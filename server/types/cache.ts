export type CacheTTL = 'short' | 'medium' | 'long' | number
export interface CacheOptions {
  cacheControl?: string
  vary?: string[]
}
export interface CachedResponse {
  body: string
  contentType: string
  status: 200
  expires: number
}
