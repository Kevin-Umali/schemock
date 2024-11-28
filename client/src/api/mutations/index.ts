import { GenerateBodyCSV, GenerateBodySQL, GenerateBodyTemplate, type GenerateBodyJSON } from '@server/schema/generate.schema'
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

const generateCSVbySchema = async (data: GenerateBodyCSV) => {
  const res = await api.generate.csv.$post({
    json: data,
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

const generateSQLbySchema = async (data: GenerateBodySQL) => {
  const res = await api.generate.sql.$post({
    json: data,
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

const generateTemplatebySchema = async (data: GenerateBodyTemplate) => {
  const res = await api.generate.template.$post({
    json: data,
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
