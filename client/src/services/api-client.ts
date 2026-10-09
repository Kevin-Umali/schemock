import { apiUrl } from '@/utils/api-url'

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
  format: 'json' | 'text' = 'json',
): Promise<T> => {
  const response = await fetch(apiUrl(path), options)
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string
      error?: string
      errors?: {
        path: string
        message: string
      }[]
    } | null
    throw new Error(
      body?.errors?.map((issue) => `${issue.path}: ${issue.message}`).join('\n') ||
        body?.message ||
        body?.error ||
        `Request failed (${response.status}). Please try again.`,
    )
  }
  return (format === 'text' ? await response.text() : await response.json()) as T
}
