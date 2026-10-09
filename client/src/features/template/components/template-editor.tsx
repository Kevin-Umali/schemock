import { SearchSelect } from '@/components/ui/search-select'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import type { FakerMethodCategory } from '@/types/faker'
import type * as React from 'react'
import { useMemo, useRef, useState } from 'react'
import { getTemplateGeneratorOptions } from '../utils/config'
interface EditorProps {
  initialContent?: string
  onChange: (content: string) => void
  fakerMethods: FakerMethodCategory[]
}
const TemplateEditor: React.FC<EditorProps> = ({ initialContent = '', onChange, fakerMethods }) => {
  const [text, setText] = useState(initialContent)
  const [insertion, setInsertion] = useState(0)
  const input = useRef<HTMLTextAreaElement>(null)
  const options = useMemo(() => getTemplateGeneratorOptions(fakerMethods), [fakerMethods])
  const insertGenerator = (method: string) => {
    const start = input.current?.selectionStart ?? text.length
    const end = input.current?.selectionEnd ?? start
    const placeholder = `{{${method}}}`
    const next = text.slice(0, start) + placeholder + text.slice(end)
    setText(next)
    onChange(next)
    setInsertion((previous) => previous + 1)
    requestAnimationFrame(() => {
      input.current?.focus()
      input.current?.setSelectionRange(start + placeholder.length, start + placeholder.length)
    })
  }
  return (
    <div className='grid gap-3'>
      <Field name='template-text' className='gap-2'>
        <FieldLabel htmlFor='template-text'>Template text</FieldLabel>
        <Textarea
          id='template-text'
          ref={input}
          className='min-h-64 font-mono leading-7'
          value={text}
          spellCheck={false}
          placeholder='Hello {{person.fullName}}…'
          onChange={(event) => {
            setText(event.target.value)
            onChange(event.target.value)
          }}
        />
      </Field>
      <div className='grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center'>
        <SearchSelect
          key={insertion}
          value=''
          options={options}
          onChange={insertGenerator}
          label='Insert a generator'
        />
        <span className='text-xs text-muted-foreground'>Inserts at your cursor.</span>
      </div>
    </div>
  )
}
export default TemplateEditor
