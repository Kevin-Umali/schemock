import { checkSchema } from '@/utils/schema-validation'
import { Button } from '@/components/ui/button'
import { SCHEMA_EDITOR_SETUP } from '@/constants/schema-editor'
import type { FakerMethodCategory } from '@/types/faker'
import type { Schema } from '@/types/schema'
interface SchemaCodeEditorProps {
  value: string
  methods: FakerMethodCategory[]
  onChange: (value: string, schema: Schema | undefined, error: string) => void
}
import { generatorCompletions, schemaDiagnostics, suggestGenerator } from '@/utils/schema-editor'
import { autocompletion } from '@codemirror/autocomplete'
import { json } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'
import { EditorView, keymap } from '@codemirror/view'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { AlignLeft, CheckCircle2, CircleAlert, WandSparkles } from 'lucide-react'
import type * as React from 'react'
import { useMemo, useRef, useState } from 'react'

export const SchemaCodeEditor: React.FC<SchemaCodeEditorProps> = ({ value, methods, onChange }) => {
  const editor = useRef<ReactCodeMirrorRef>(null)
  const [formatError, setFormatError] = useState('')
  const check = useMemo(() => checkSchema(value, methods), [value, methods])
  const change = (next: string) => {
    setFormatError('')
    const result = checkSchema(next, methods)
    onChange(next, result.schema, result.issues[0]?.message ?? '')
  }
  const format = () => {
    try {
      change(JSON.stringify(JSON.parse(value), null, 2))
    } catch {
      setFormatError('Fix the JSON syntax before formatting. Check the underlined errors in the editor.')
    }
  }
  const extensions = useMemo(
    () => [
      json(),
      EditorView.contentAttributes.of({ 'aria-label': 'Schema JSON', 'aria-describedby': 'schema-editor-help' }),
      autocompletion({ override: [(context) => generatorCompletions(context, methods)], maxRenderedOptions: 15 }),
      linter((view) => schemaDiagnostics(view, methods), { delay: 250 }),
      lintGutter(),
      keymap.of([
        {
          key: 'Mod-Shift-f',
          run: (view) => {
            try {
              const next = JSON.stringify(JSON.parse(view.state.doc.toString()), null, 2)
              view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } })
            } catch {
              return false
            }
            return true
          },
        },
      ]),
    ],
    [methods],
  )
  const issue = formatError || check.issues[0]?.message
  return (
    <div className=''>
      <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
        <span className='flex items-center gap-1.5 text-xs text-foreground' role='status'>
          {issue ? <CircleAlert size={14} /> : <CheckCircle2 size={14} />}
          {issue ? `${check.issues.length || 1} issue${check.issues.length > 1 ? 's' : ''}` : 'Valid schema'}
        </span>
        <div className='flex gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              if (editor.current?.view) {
                suggestGenerator(editor.current.view)
              }
            }}
          >
            <WandSparkles data-icon='inline-start' /> Suggest
          </Button>
          <Button variant='outline' size='sm' onClick={format} title='Format JSON (Ctrl/Cmd + Shift + F)'>
            <AlignLeft data-icon='inline-start' /> Beautify
          </Button>
        </div>
      </div>
      <CodeMirror
        theme='none'
        ref={editor}
        value={value}
        minHeight='340px'
        maxHeight='600px'
        extensions={extensions}
        basicSetup={SCHEMA_EDITOR_SETUP}
        onChange={change}
        className='overflow-hidden rounded-md border text-xs [&_.cm-editor]:bg-card [&_.cm-editor]:text-foreground [&_.cm-editor.cm-focused]:outline-ring [&_.cm-scroller]:font-mono [&_.cm-scroller]:leading-7 [&_.cm-gutters]:border-border [&_.cm-gutters]:bg-muted [&_.cm-gutters]:text-muted-foreground [&_.cm-content]:py-2 [&_.cm-activeLine]:bg-muted/40! [&_.cm-activeLineGutter]:bg-muted! [&_.cm-cursor]:border-l-foreground! [&_.cm-selectionBackground]:bg-muted! [&_.cm-tooltip-autocomplete_li[aria-selected=true]]:bg-primary! [&_.cm-tooltip-autocomplete_li[aria-selected=true]]:text-primary-foreground! [&_.cm-tooltip]:border-border [&_.cm-tooltip]:bg-popover [&_.cm-tooltip]:text-popover-foreground [&_.cm-tooltip-autocomplete]:max-w-[min(30rem,calc(100vw-3rem))]'
      />
      {issue && (
        <p className='mt-3 rounded-md border bg-muted p-3 text-xs leading-relaxed' role='alert'>
          {issue}
        </p>
      )}
      <p
        id='schema-editor-help'
        className='mt-4 text-xs leading-relaxed text-muted-foreground [&_code]:font-mono [&_code]:text-[11px]'
      >
        Type inside a value to see Faker suggestions. Ctrl/Cmd + Space opens suggestions. Arrays use{' '}
        <code>{'{ "items": "lorem.word", "count": 3 }'}</code>.
      </p>
    </div>
  )
}
