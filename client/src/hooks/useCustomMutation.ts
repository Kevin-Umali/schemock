import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query'
import { RequestOptions } from '@/api/mutations'

/**
 * Custom hook that creates a mutation function with support for headers
 * 
 * @param mutationFn - The mutation function to wrap
 * @param options - Standard mutation options
 * @returns A mutation result with the wrapped mutation function
 */
export function useCustomMutation<TData, TError, TVariables>(
  mutationFn: (data: TVariables, options?: RequestOptions) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
): UseMutationResult<TData, TError, TVariables & { headers?: Record<string, string> }> {
  return useMutation({
    ...options,
    mutationFn: (variables: TVariables & { headers?: Record<string, string> }) => {
      const { headers, ...data } = variables as any
      return mutationFn(data as TVariables, { headers })
    },
  })
}
