import { type HelperPath } from '@server/schema/helper.schema'
import { api } from '@/api/api'
import { queryOptions, useQuery } from '@tanstack/react-query'

const getHelperEnums = async (name: HelperPath['name']) => {
  const res = await api.helper.enum[':name'].$get({
    param: {
      name: name,
    },
  })

  if (!res.ok) throw new Error('Server error')

  return (await res.json()).data
}

export const getHelperEnumsQueryOptions = (helperParam: HelperPath) => {
  return queryOptions({
    queryKey: ['get-helper-enums', helperParam.name] as const,
    queryFn: () => getHelperEnums(helperParam.name),
    enabled: Boolean(helperParam.name),
  })
}

export const useGetHelperEnums = (helperParam: HelperPath) => {
  return useQuery(getHelperEnumsQueryOptions(helperParam))
}

const getFakerFunctions = async () => {
  const res = await api.helper.faker.$get()

  if (!res.ok) throw new Error('Server error')

  return (await res.json()).data
}

export const getFakerFunctionsQueryOptions = () => {
  return queryOptions({
    queryKey: ['get-faker-functions'] as const,
    queryFn: () => getFakerFunctions(),
    enabled: true,
  })
}

export const useGetFakerFunctions = () => {
  return useQuery(getFakerFunctionsQueryOptions())
}
