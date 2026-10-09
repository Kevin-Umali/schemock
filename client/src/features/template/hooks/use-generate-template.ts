import { apiRequest } from '@/services/api-client'
import { useMutation } from '@tanstack/react-query'
import type { TemplateRequest } from '../types/api'
export const useGenerateTemplateWithOptions = () => {
  return useMutation({
    mutationKey: ['generate-template'],
    mutationFn: async ({ headers, ...body }: TemplateRequest) =>
      (
        await apiRequest<{
          data: string[]
        }>('/generate/template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify(body),
        })
      ).data,
  })
}
