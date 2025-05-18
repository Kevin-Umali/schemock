// src/components/custom/schema-builder.tsx

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import FakerMethodSelector from './faker-method-selector'
import { Textarea } from '@/components/ui/textarea'

interface SchemaField {
  id: string
  key: string
  value: string
  example?: string
}

interface SchemaBuilderProps {
  initialSchema?: Record<string, string>
  onChange: (schema: Record<string, string>) => void
  textareaMode?: boolean
  textareaValue?: string
  onTextareaChange?: (value: string) => void
  fakerMethods?: any[]
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({
  initialSchema = {},
  onChange,
  textareaMode = false,
  textareaValue = '',
  onTextareaChange,
  fakerMethods = [],
}) => {
  const [fields, setFields] = useState<SchemaField[]>(() => {
    if (Object.keys(initialSchema).length === 0) {
      return [
        { id: '1', key: 'name', value: 'person.firstName', example: '' },
        { id: '2', key: 'email', value: 'internet.email', example: '' },
      ]
    }

    return Object.entries(initialSchema).map(([key, value], index) => ({
      id: String(index + 1),
      key,
      value: String(value),
      example: '',
    }))
  })

  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const [examples, setExamples] = useState<Record<string, string>>({})

  // Update the parent component when fields change
  useEffect(() => {
    if (!textareaMode) {
      const schema = fields.reduce(
        (acc, field) => {
          if (field.key.trim() !== '') {
            acc[field.key] = field.value
          }
          return acc
        },
        {} as Record<string, string>,
      )

      onChange(schema)
    }
  }, [fields, onChange, textareaMode])

  const addField = useCallback(() => {
    setFields((prev) => [...prev, { id: String(Date.now()), key: '', value: '', example: '' }])
  }, [])

  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id))
  }, [])

  const updateField = useCallback((id: string, key: string, value: string) => {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, [key]: value } : field)))
  }, [])

  const handleMethodSelect = useCallback(
    (id: string, method: string, example: string) => {
      updateField(id, 'value', method)
      setExamples((prev) => ({ ...prev, [id]: example }))
      setActiveFieldId(null)
    },
    [updateField],
  )

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onTextareaChange) {
        onTextareaChange(e.target.value)
      }
    },
    [onTextareaChange],
  )

  if (textareaMode) {
    return (
      <Textarea value={textareaValue} onChange={handleTextareaChange} className='font-mono text-sm min-h-[200px]' placeholder='Enter your schema as JSON...' />
    )
  }

  return (
    <div className='space-y-4'>
      <AnimatePresence>
        {fields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='flex items-start gap-2'
          >
            <div className='flex-1'>
              <Input placeholder='Field name' value={field.key} onChange={(e) => updateField(field.id, 'key', e.target.value)} className='mb-2' />
            </div>
            <div className='flex-1 relative'>
              <FakerMethodSelector
                value={field.value}
                onSelect={(method: string, example: string) => handleMethodSelect(field.id, method, example)}
                onOpenChange={(open: boolean) => setActiveFieldId(open ? field.id : null)}
                isOpen={activeFieldId === field.id}
                fakerMethods={fakerMethods}
              />
              {examples[field.id] && (
                <div className='text-xs text-muted-foreground mt-1 ml-1'>
                  Example: <span className='font-mono bg-muted px-1 py-0.5 rounded'>{examples[field.id]}</span>
                </div>
              )}
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => removeField(field.id)}
              className={cn('flex-shrink-0 text-muted-foreground hover:text-destructive', fields.length <= 1 && 'opacity-50 cursor-not-allowed')}
              disabled={fields.length <= 1}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button variant='outline' size='sm' onClick={addField} className='w-full mt-2'>
        <Plus className='h-4 w-4 mr-2' />
        Add Field
      </Button>
    </div>
  )
}

export default SchemaBuilder
