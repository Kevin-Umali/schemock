import { Braces, Brackets, Database, Equal } from 'lucide-react'

export const FIELD_KINDS = [
  { value: 'generator', label: 'Faker', icon: Database, description: 'Generate a new value for every record.' },
  { value: 'object', label: 'Object', icon: Braces, description: 'Group named fields inside this field.' },
  { value: 'array', label: 'Array', icon: Brackets, description: 'Repeat an item schema a set number of times.' },
  { value: 'fixed', label: 'Fixed', icon: Equal, description: 'Use the same value in every record.' },
] as const

export const FIXED_VALUE_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'null', label: 'Null' },
]
