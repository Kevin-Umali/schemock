import { API_BASE_URL } from '@/constants/api'

export const apiUrl = (path: string): string => `${API_BASE_URL}/${path.replace(/^\/+/, '')}`

export const absoluteApiUrl = (path: string): string => new URL(apiUrl(path), window.location.origin).href
