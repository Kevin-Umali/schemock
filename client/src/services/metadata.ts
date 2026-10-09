import type { HelperPath } from '@/types/api'
import { apiRequest } from '@/services/api-client'
import type { FakerMethodCategory } from '@/types/faker'
import { queryOptions, useQuery } from '@tanstack/react-query'
export const getHelperEnumsQueryOptions = ({ name }: HelperPath) =>
  queryOptions({
    queryKey: ['get-helper-enums', name] as const,
    queryFn: async () =>
      (
        await apiRequest<{
          data: string[]
        }>(`/helper/enum/${name}`)
      ).data,
    staleTime: 60 * 60 * 1000,
  })
export const useGetHelperEnums = (parameters: HelperPath) => useQuery(getHelperEnumsQueryOptions(parameters))
export const getFakerFunctionsQueryOptions = () =>
  queryOptions({
    queryKey: ['get-faker-functions'] as const,
    queryFn: async () =>
      (
        await apiRequest<{
          data: FakerMethodCategory[]
        }>('/helper/faker')
      ).data,
    staleTime: 60 * 60 * 1000,
  })
export const useGetFakerFunctions = () => useQuery(getFakerFunctionsQueryOptions())
