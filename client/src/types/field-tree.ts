import type { Schema, SchemaValue } from '@/types/schema'
import type { FieldSourceKind } from '@/types/field-editor'

export type FieldPathSegment = { kind: 'field'; name: string } | { kind: 'items' }
export type FieldPath = FieldPathSegment[]

export interface FieldTreeNode {
  path: FieldPath
  name: string
  value: SchemaValue
  kind: FieldSourceKind
  children: FieldTreeNode[]
}

export interface FieldEditorUndoSnapshot {
  schema: Schema
  path: FieldPath
  label: string
}
