import { type GenerateBodyJSON } from '@server/schema/generate.schema'
import { api } from '@/api/api'
import { useMutation } from '@tanstack/react-query'

const generateJSONbySchema = async (data: GenerateBodyJSON) => {
  const res = await api.generate.json.$post({
    json: data,
  })

  if (!res.ok) throw new Error('Server error')

  return (await res.json()).data
}

export const useGenerateJSON = () => {
  return useMutation({
    mutationKey: ['generate-json'],
    mutationFn: generateJSONbySchema,
  })
}
