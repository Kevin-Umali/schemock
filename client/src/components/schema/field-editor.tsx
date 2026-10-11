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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SCHEMA_LIMITS } from '@/constants/schema-editor'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useWorkspaceLayout } from '@/hooks/use-workspace-layout'
import { cn } from '@/utils/classes'
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
import { ChevronDown, ChevronsDownUp, LocateFixed, PanelLeftClose, PanelLeftOpen, Plus, RotateCcw } from 'lucide-react'
import type * as React from 'react'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface FieldEditorProps {
  schema: Schema
  onChange: (schema: Schema) => void
  methods: FakerMethodCategory[]
  onValidityChange?: (valid: boolean) => void
  fillHeight?: boolean
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  schema,
  onChange,
  methods,
  onValidityChange,
  fillHeight = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const layout = useWorkspaceLayout({ outline: 35, settings: 65 })
  const [wide, setWide] = useState(false)
  const outlineHidden = layout.hidden.outline
  const fill = fillHeight && wide
  const [showParents, setShowParents] = useState(false)
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
  const breadcrumbs = getFieldBreadcrumbs(selected)
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
    const editor = editorRef.current
    if (!editor) return
    const observer = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= 672))
    observer.observe(editor)
    return () => observer.disconnect()
  }, [])
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
    <div
      ref={editorRef}
      className={cn(
        '@container/schema min-w-0',
        fillHeight && 'flex h-full min-h-0 flex-col',
        fillHeight && (wide ? 'overflow-hidden' : 'overflow-y-auto'),
      )}
    >
      <ResizablePanelGroup
        groupRef={layout.groupRef}
        orientation='horizontal'
        disabled={!wide}
        data-stacked={!wide || undefined}
        style={{ height: fill ? '100%' : 'auto' }}
        className={cn('min-w-0', fill && 'min-h-0 flex-1')}
      >
        <ResizablePanel
          {...layout.panelProps('outline')}
          minSize={wide ? '25%' : 0}
          maxSize={wide ? '55%' : '100%'}
          collapsible={wide}
          inert={wide && outlineHidden}
          className={cn('min-w-0 overflow-hidden!', fill && 'h-full')}
        >
          <Collapsible
            open={wide || outlineOpen}
            onOpenChange={(open) => {
              if (wide) layout.toggle('outline')
              else setOutlineOpen(open)
            }}
            className={cn(
              'min-w-0 border-b border-border bg-muted/30 @min-[42rem]/schema:border-b-0',
              fill && 'flex h-full min-h-0 flex-col',
            )}
          >
            <div className='flex min-h-14 shrink-0 items-center justify-between gap-2 px-3'>
              <CollapsibleTrigger
                render={<Button variant='ghost' size='sm' />}
                className='min-w-0 flex-1 justify-start px-1 text-start'
                aria-label={wide ? 'Hide schema outline' : 'Toggle schema outline'}
              >
                {wide ? <PanelLeftClose data-icon='inline-start' /> : <ChevronDown data-icon='inline-start' />}
                Schema outline
                <span
                  className='ml-auto font-normal tabular-nums text-muted-foreground'
                  title='Total fields including nested children'
                >
                  {countSchemaFields(schema, true)}
                </span>
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
            <CollapsibleContent className={cn('px-2 pb-3', fill && 'flex min-h-0 flex-1 flex-col')}>
              <div className='mb-2 flex shrink-0 flex-wrap gap-1 px-1'>
                <Button variant='ghost' size='sm' onClick={() => setExpandedPaths({})}>
                  <ChevronsDownUp data-icon='inline-start' />
                  Collapse all
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={!selected.length}
                  onClick={() => {
                    setExpandedPaths(getExpandedAncestorPaths(selected))
                    requestAnimationFrame(() =>
                      editorRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest' }),
                    )
                  }}
                >
                  <LocateFixed data-icon='inline-start' />
                  Reveal selected
                </Button>
              </div>
              {tree.length ? (
                <nav
                  aria-label='Schema fields'
                  className={cn(
                    'overflow-y-auto overscroll-contain',
                    fill ? 'min-h-0 flex-1' : 'max-h-96 @min-[42rem]/schema:max-h-[44rem]',
                  )}
                >
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
                className='mt-3 w-full shrink-0'
                disabled={Object.keys(schema).length >= SCHEMA_LIMITS.fields}
                onClick={() => add([])}
              >
                <Plus data-icon='inline-start' />
                Add root field
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          aria-label='Resize schema outline'
          disabled={!wide}
          className={wide ? '' : 'hidden'}
        />
        <ResizablePanel
          {...layout.panelProps('settings')}
          minSize={wide ? '45%' : 0}
          className={cn('min-w-0 overflow-hidden!', fill && 'h-full')}
        >
          <section aria-label='Field settings' className={cn('min-w-0', fill && 'flex h-full min-h-0 flex-col')}>
            {wide && outlineHidden && (
              <div className='shrink-0 border-b px-5 py-2 md:px-6'>
                <Button variant='outline' size='sm' onClick={() => layout.show('outline')}>
                  <PanelLeftOpen data-icon='inline-start' />
                  Show schema outline
                </Button>
              </div>
            )}
            {selected.length > 0 && (
              <Breadcrumb className='max-h-40 shrink-0 overflow-y-auto border-b border-border px-5 py-3 md:px-6'>
                <BreadcrumbList className='gap-1.5'>
                  <BreadcrumbItem>
                    <span className='text-xs text-muted-foreground'>Root</span>
                  </BreadcrumbItem>
                  {breadcrumbs.length > 3 && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='px-1 text-xs'
                          aria-expanded={showParents}
                          onClick={() => setShowParents((open) => !open)}
                        >
                          {showParents ? 'Fewer parents' : `${breadcrumbs.length - 2} parents`}
                        </Button>
                      </BreadcrumbItem>
                    </>
                  )}
                  {(showParents || breadcrumbs.length <= 3 ? breadcrumbs : breadcrumbs.slice(-2)).map((crumb) => (
                    <Fragment key={pathKey(crumb.path)}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem className='min-w-0'>
                        {pathKey(crumb.path) === selectedKey ? (
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
            <div className={cn('min-w-0 p-5 md:p-6', fill && 'min-h-0 flex-1 overflow-y-auto overscroll-contain')}>
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
                    update(renameSchemaField(schema, selected, name), [
                      ...selected.slice(0, -1),
                      { kind: 'field', name },
                    ])
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
        </ResizablePanel>
      </ResizablePanelGroup>
      {undo && (
        <Alert className='flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-none border-x-0 border-b-0'>
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
