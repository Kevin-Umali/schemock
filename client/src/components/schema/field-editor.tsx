import { FieldInspector } from '@/components/schema/field-inspector'
import { FieldTree } from '@/components/schema/field-tree'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { SCHEMA_LIMITS } from '@/constants/schema-editor'
import { useIsMobile } from '@/hooks/use-is-mobile'
import type { FakerMethodCategory } from '@/types/faker'
import type { FieldEditorUndoSnapshot, FieldPath } from '@/types/field-tree'
import type { Schema, SchemaValue } from '@/types/schema'
import { countSchemaFields } from '@/utils/field-inspector'
import {
  addSchemaField,
  duplicateSchemaField,
  formatFieldPath,
  getExpandedAncestorPaths,
  getFieldBreadcrumbs,
  getFieldTree,
  getFirstFieldPath,
  getInvalidFieldPaths,
  getParentSchema,
  getSchemaValue,
  moveSchemaField,
  pathKey,
  removeSchemaField,
  renameSchemaField,
  setSchemaValue,
} from '@/utils/field-tree'
import { isValidFieldSchema } from '@/utils/fields'
import { ChevronDown, Plus, RotateCcw } from 'lucide-react'
import type * as React from 'react'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface FieldEditorProps {
  schema: Schema
  onChange: (schema: Schema) => void
  methods: FakerMethodCategory[]
  onValidityChange?: (valid: boolean) => void
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ schema, onChange, methods, onValidityChange }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const focusInspector = useRef(false)
  const isMobile = useIsMobile()
  const [outlineOpen, setOutlineOpen] = useState(true)
  const [selectedPath, setSelectedPath] = useState<FieldPath>(() => getFirstFieldPath(schema) ?? [])
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({})
  const [draftValid, setDraftValid] = useState(true)
  const [notice, setNotice] = useState('')
  const [resetVersion, setResetVersion] = useState(0)
  const [undo, setUndo] = useState<FieldEditorUndoSnapshot | null>(null)
  const tree = useMemo(() => getFieldTree(schema, methods), [schema, methods])
  const selected =
    selectedPath.length && getSchemaValue(schema, selectedPath) !== undefined
      ? selectedPath
      : (getFirstFieldPath(schema) ?? [])
  const selectedKey = pathKey(selected)
  const value = selected.length ? getSchemaValue(schema, selected) : undefined
  const invalidSchemaPaths = useMemo(() => getInvalidFieldPaths(tree, methods), [tree, methods])
  const invalidPaths = new Set([...invalidSchemaPaths, ...(!draftValid ? [selectedKey] : [])])
  const valid =
    draftValid &&
    Object.keys(schema).length > 0 &&
    Object.values(schema).every((field) => isValidFieldSchema(field, methods, 1))
  const reportDraftValidity = useCallback((next: boolean) => setDraftValid(next), [])
  useEffect(() => onValidityChange?.(valid), [valid, onValidityChange])
  useEffect(() => {
    if (!focusInspector.current) return
    focusInspector.current = false
    const target =
      editorRef.current?.querySelector<HTMLElement>('[data-field-inspector-heading]') ??
      editorRef.current?.querySelector<HTMLElement>('[data-add-root-field]')
    target?.focus()
  }, [selectedKey, schema, resetVersion])

  const navigate = (path: FieldPath) => {
    if (!draftValid) {
      setNotice('Finish the highlighted edits, or discard them before opening another field.')
      editorRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    focusInspector.current = true
    if (isMobile) setOutlineOpen(false)
    setSelectedPath(path)
    setExpandedPaths((current) => ({ ...current, ...getExpandedAncestorPaths(path) }))
    setNotice('')
  }
  const update = (nextSchema: Schema, path = selected, label?: string) => {
    setUndo(label ? { schema, path: selected, label } : null)
    setNotice('')
    onChange(nextSchema)
    if (pathKey(path) !== selectedKey) {
      setDraftValid(true)
      focusInspector.current = true
      setSelectedPath(path)
      setExpandedPaths((current) => ({ ...current, ...getExpandedAncestorPaths(path) }))
    }
  }
  const add = (path: FieldPath) => {
    if (!draftValid) return navigate(selected)
    const result = addSchemaField(schema, path)
    update(result.schema, result.path)
  }

  return (
    <div ref={editorRef} className='min-w-0'>
      <div className='grid min-w-0 grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]'>
        <Collapsible
          open={outlineOpen}
          onOpenChange={setOutlineOpen}
          className='min-w-0 border-b border-border bg-muted/30 lg:border-e lg:border-b-0'
        >
          <div className='flex min-h-14 items-center justify-between gap-3 px-4'>
            <CollapsibleTrigger
              className='flex min-h-11 flex-1 items-center gap-2 text-start text-sm font-medium outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring'
              aria-label='Toggle schema outline'
            >
              Schema outline<span className='font-normal text-muted-foreground'>{countSchemaFields(schema, true)}</span>
              <ChevronDown className='ms-auto size-4' aria-hidden='true' />
            </CollapsibleTrigger>
            <Button
              data-add-root-field
              variant='ghost'
              size='icon-sm'
              aria-label='Add root field'
              disabled={Object.keys(schema).length >= SCHEMA_LIMITS.fields}
              onClick={() => add([])}
            >
              <Plus />
            </Button>
          </div>
          <CollapsibleContent className='px-2 pb-3'>
            {tree.length ? (
              <nav aria-label='Schema fields' className='max-h-72 overflow-y-auto overscroll-contain lg:max-h-[36rem]'>
                <FieldTree
                  nodes={tree}
                  selectedPath={selected}
                  expandedPaths={expandedPaths}
                  invalidPaths={invalidPaths}
                  onSelect={navigate}
                  onToggle={(key, open) => setExpandedPaths((current) => ({ ...current, [key]: open }))}
                />
              </nav>
            ) : (
              <p className='px-3 py-4 text-sm text-muted-foreground'>No fields yet.</p>
            )}
            <Button
              variant='outline'
              size='sm'
              className='mt-3 w-full'
              disabled={Object.keys(schema).length >= SCHEMA_LIMITS.fields}
              onClick={() => add([])}
            >
              <Plus data-icon='inline-start' />
              Add root field
            </Button>
          </CollapsibleContent>
        </Collapsible>
        <section aria-label='Field settings' className='min-w-0'>
          {selected.length > 0 && (
            <Breadcrumb className='border-b border-border px-5 py-3 md:px-6'>
              <BreadcrumbList className='gap-1.5'>
                <BreadcrumbItem>
                  <span className='text-xs text-muted-foreground'>Root</span>
                </BreadcrumbItem>
                {getFieldBreadcrumbs(selected).map((crumb, index) => (
                  <Fragment key={pathKey(crumb.path)}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className='min-w-0'>
                      {index === selected.length - 1 ? (
                        <BreadcrumbPage className='break-all font-mono text-xs'>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='max-w-full whitespace-normal break-all px-1 font-mono text-xs'
                          onClick={() => navigate(crumb.path)}
                        >
                          {crumb.label}
                        </Button>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className='min-w-0 p-5 md:p-6'>
            {notice && (
              <Alert variant='destructive' className='mb-5'>
                <AlertDescription>
                  {notice}
                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-3'
                    onClick={() => {
                      setResetVersion((version) => version + 1)
                      setDraftValid(true)
                      setNotice('')
                    }}
                  >
                    Discard edits
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            {value !== undefined ? (
              <FieldInspector
                key={`${selectedKey}-${resetVersion}`}
                path={selected}
                value={value}
                parent={getParentSchema(schema, selected)}
                methods={methods}
                onValidityChange={reportDraftValidity}
                onNavigate={navigate}
                onAdd={add}
                onChange={(nextValue: SchemaValue, label?: string) =>
                  update(setSchemaValue(schema, selected, nextValue), selected, label)
                }
                onRename={(name) =>
                  update(renameSchemaField(schema, selected, name), [...selected.slice(0, -1), { kind: 'field', name }])
                }
                onDuplicate={() => {
                  if (!draftValid) return navigate(selected)
                  const result = duplicateSchemaField(schema, selected)
                  update(result.schema, result.path)
                }}
                onMove={(offset) => {
                  if (!draftValid) return navigate(selected)
                  update(moveSchemaField(schema, selected, offset))
                }}
                onRemove={() => {
                  const result = removeSchemaField(schema, selected)
                  focusInspector.current = true
                  update(result.schema, result.path, `Removed ${formatFieldPath(selected)}.`)
                }}
              />
            ) : (
              <Empty className='min-h-60'>
                <EmptyTitle>Define your first field</EmptyTitle>
                <EmptyDescription>Add a root field, then choose how its value is created.</EmptyDescription>
                <Button variant='outline' onClick={() => add([])}>
                  <Plus data-icon='inline-start' />
                  Add field
                </Button>
              </Empty>
            )}
          </div>
        </section>
      </div>
      {undo && (
        <Alert className='flex flex-wrap items-center justify-between gap-3 rounded-none border-x-0 border-b-0'>
          <AlertDescription className='min-w-0 break-words'>{undo.label}</AlertDescription>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              focusInspector.current = true
              onChange(undo.schema)
              setSelectedPath(undo.path)
              setResetVersion((version) => version + 1)
              setDraftValid(true)
              setUndo(null)
            }}
          >
            <RotateCcw data-icon='inline-start' />
            Undo
          </Button>
        </Alert>
      )}
    </div>
  )
}
