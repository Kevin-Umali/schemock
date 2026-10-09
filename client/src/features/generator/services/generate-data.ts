import type { GeneratorSettings } from '@/features/generator/types/settings'
import { apiRequest } from '@/services/api-client'
import type { OutputFormat } from '@/types/schema'
export const requestData = async (format: OutputFormat, settings: GeneratorSettings): Promise<unknown> => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Flatten-Objects': String(settings.flatten) },
    body: JSON.stringify(settings),
  }
  return format === 'json'
    ? (
        await apiRequest<{
          data: unknown
        }>('/generate/json', options)
      ).data
    : apiRequest<string>(`/generate/${format}`, options, 'text')
}
