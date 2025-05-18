import { GenerateBodyCSV, GenerateBodySQL, GenerateBodyTemplate, type GenerateBodyJSON } from '@server/schema/generate.schema'
import { api } from '@/api/api'
import { useMutation } from '@tanstack/react-query'
import { useCustomMutation } from '@/hooks/useCustomMutation'

// Define a custom RequestOptions interface that includes headers
export interface RequestOptions {
  headers?: Record<string, string>
}

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

const generateCSVbySchema = async (data: GenerateBodyCSV, options?: RequestOptions) => {
  const res = await api.generate.csv.$post({
    json: data,
    headers: options?.headers,
  })

  if (!res.ok) throw new Error('Server error')

  return await res.text()
}

export const useGenerateCSV = () => {
  return useMutation({
    mutationKey: ['generate-csv'],
    mutationFn: generateCSVbySchema,
  })
}

// Custom hook that supports headers
export const useGenerateCSVWithOptions = () => {
  return useCustomMutation(generateCSVbySchema, {
    mutationKey: ['generate-csv'],
  })
}

const generateSQLbySchema = async (data: GenerateBodySQL, options?: RequestOptions) => {
  const res = await api.generate.sql.$post({
    json: data,
    headers: options?.headers,
  })

  if (!res.ok) throw new Error('Server error')

  return await res.text()
}

export const useGenerateSQL = () => {
  return useMutation({
    mutationKey: ['generate-sql'],
    mutationFn: generateSQLbySchema,
  })
}

// Custom hook that supports headers
export const useGenerateSQLWithOptions = () => {
  return useCustomMutation(generateSQLbySchema, {
    mutationKey: ['generate-sql'],
  })
}

const generateTemplatebySchema = async (data: GenerateBodyTemplate, options?: RequestOptions) => {
  const res = await api.generate.template.$post({
    json: data,
    headers: options?.headers,
  })

  if (!res.ok) throw new Error('Server error')

  return (await res.json()).data
}

export const useGenerateTemplate = () => {
  return useMutation({
    mutationKey: ['generate-template'],
    mutationFn: generateTemplatebySchema,
  })
}

// Custom hook that supports headers
export const useGenerateTemplateWithOptions = () => {
  return useCustomMutation(generateTemplatebySchema, {
    mutationKey: ['generate-template'],
  })
}
