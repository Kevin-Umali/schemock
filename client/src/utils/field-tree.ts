import { DEFAULT_NEW_FIELD_VALUE, FIELD_TREE_MAX_DEPTH } from '@/constants/field-tree'
import { RESERVED_FIELD_NAMES } from '@/constants/schema-editor'
import type { FieldPath, FieldPathSegment, FieldTreeNode } from '@/types/field-tree'
import type { FakerMethodCategory } from '@/types/faker'
import type { Schema, SchemaValue } from '@/types/schema'
import { duplicateField, getFieldSummary, isValidFieldSchema, moveField } from '@/utils/fields'
import { isArraySchema, isObject } from '@/utils/schema'

const isSchemaObject = (value: unknown): value is Schema => isObject(value) && !isArraySchema(value as SchemaValue)
const isFieldContainer = (value: unknown, root: boolean): value is Schema =>
  isObject(value) && (root || !isArraySchema(value as SchemaValue))

const cloneWithField = (schema: Schema, name: string, value: SchemaValue): Schema => ({ ...schema, [name]: value })

const readPath = (schema: Schema, path: FieldPath): SchemaValue | undefined => {
  let current: SchemaValue = schema
  for (const [index, segment] of path.entries()) {
    if (segment.kind === 'items') {
      if (!isArraySchema(current)) return undefined
      current = current.items
    } else {
      if (!isFieldContainer(current, index === 0) || !Object.hasOwn(current, segment.name)) return undefined
      current = current[segment.name]
    }
  }
  return current
}

const updatePath = (current: SchemaValue, path: FieldPath, value: SchemaValue, index = 0): SchemaValue | undefined => {
  if (index === path.length) return value
  const segment = path[index]
  if (!segment) return undefined
  if (segment.kind === 'items') {
    if (!isArraySchema(current)) return undefined
    const items = updatePath(current.items, path, value, index + 1)
    return items === undefined ? undefined : { ...current, items }
  }
  if (!isFieldContainer(current, index === 0) || !Object.hasOwn(current, segment.name)) return undefined
  const updated = updatePath(current[segment.name], path, value, index + 1)
  return updated === undefined ? undefined : cloneWithField(current, segment.name, updated)
}

const getObjectAtPath = (schema: Schema, path: FieldPath): Schema | undefined => {
  if (!path.length) return schema
  const value = readPath(schema, path)
  return isSchemaObject(value) ? value : undefined
}

const pathForField = (path: FieldPath, name: string): FieldPath => [...path, { kind: 'field', name }]

export const pathKey = (path: FieldPath): string => JSON.stringify(path)

export const getExpandedAncestorPaths = (path: FieldPath): Record<string, boolean> =>
  Object.fromEntries(path.map((_, index) => [pathKey(path.slice(0, index + 1)), true]))

export const getInvalidFieldPaths = (nodes: FieldTreeNode[], methods: FakerMethodCategory[]): Set<string> => {
  const paths = new Set<string>()
  for (const node of nodes) {
    if (!isValidFieldSchema(node.value, methods, node.path.length)) paths.add(pathKey(node.path))
    for (const childPath of getInvalidFieldPaths(node.children, methods)) paths.add(childPath)
  }
  return paths
}

export const formatFieldPath = (path: FieldPath): string => {
  let formatted = ''
  for (const segment of path) {
    if (segment.kind === 'items') formatted += '[]'
    else
      formatted += /^[a-zA-Z_$][\w$]*$/.test(segment.name)
        ? `${formatted ? '.' : ''}${segment.name}`
        : `[${JSON.stringify(segment.name)}]`
  }
  return formatted
}

export const getSchemaValue = (schema: Schema, path: FieldPath): SchemaValue | undefined => readPath(schema, path)

export const setSchemaValue = (schema: Schema, path: FieldPath, value: SchemaValue): Schema => {
  if (!path.length) return isObject(value) ? (value as Schema) : schema
  const updated = updatePath(schema, path, value)
  return isObject(updated) ? (updated as Schema) : schema
}

export const getFieldTree = (schema: Schema, methods: FakerMethodCategory[]): FieldTreeNode[] => {
  const buildNode = (name: string, value: SchemaValue, path: FieldPath, depth: number): FieldTreeNode => {
    const summary = getFieldSummary(value, methods)
    const node: FieldTreeNode = { name, value, path, kind: summary.kind, children: [] }
    if (depth >= FIELD_TREE_MAX_DEPTH) return node

    if (isArraySchema(value)) {
      const itemPath: FieldPath = [...path, { kind: 'items' }]
      node.children.push(buildNode('Each item', value.items, itemPath, depth + 1))
    } else if (isSchemaObject(value)) {
      node.children = Object.entries(value).map(([fieldName, childValue]) =>
        buildNode(fieldName, childValue, pathForField(path, fieldName), depth + 1),
      )
    }
    return node
  }

  return Object.entries(schema).map(([name, value]) => buildNode(name, value, [{ kind: 'field', name }], 1))
}

export const getFirstFieldPath = (schema: Schema): FieldPath | undefined => {
  const name = Object.keys(schema)[0]
  return name === undefined ? undefined : [{ kind: 'field', name }]
}

export const getParentSchema = (schema: Schema, path: FieldPath): Schema | undefined => {
  const lastSegment = path.at(-1)
  return lastSegment?.kind === 'field' ? getObjectAtPath(schema, path.slice(0, -1)) : undefined
}

export const getFieldBreadcrumbs = (path: FieldPath): { path: FieldPath; label: string }[] => {
  const breadcrumbs: { path: FieldPath; label: string }[] = []
  const prefix: FieldPathSegment[] = []
  for (const segment of path) {
    prefix.push(segment)
    breadcrumbs.push({
      path: [...prefix],
      label: segment.kind === 'items' ? 'Each item' : segment.name,
    })
  }
  return breadcrumbs
}

export const renameSchemaField = (schema: Schema, path: FieldPath, newName: string): Schema => {
  const name = newName.trim()
  const lastSegment = path.at(-1)
  const parent = getParentSchema(schema, path)
  if (
    lastSegment?.kind !== 'field' ||
    !parent ||
    !name ||
    RESERVED_FIELD_NAMES.has(name) ||
    (name !== lastSegment.name && Object.hasOwn(parent, name))
  ) {
    return schema
  }
  if (name === lastSegment.name) return schema

  const entries = Object.entries(parent).map(([key, value]) => [key === lastSegment.name ? name : key, value] as const)
  const updatedParent = Object.fromEntries(entries)
  return path.length === 1 ? updatedParent : setSchemaValue(schema, path.slice(0, -1), updatedParent)
}

export const addSchemaField = (schema: Schema, objectPath: FieldPath): { schema: Schema; path: FieldPath } => {
  const parent = getObjectAtPath(schema, objectPath)
  if (!parent) return { schema, path: objectPath }
  let suffix = Object.keys(parent).length + 1
  let name = `field_${suffix}`
  while (Object.hasOwn(parent, name)) name = `field_${++suffix}`
  const nextSchema = setSchemaValue(schema, objectPath, cloneWithField(parent, name, DEFAULT_NEW_FIELD_VALUE))
  return { schema: nextSchema, path: pathForField(objectPath, name) }
}

export const removeSchemaField = (schema: Schema, path: FieldPath): { schema: Schema; path: FieldPath } => {
  const lastSegment = path.at(-1)
  const parent = getParentSchema(schema, path)
  if (lastSegment?.kind !== 'field' || !parent || !Object.hasOwn(parent, lastSegment.name)) return { schema, path }

  const entries = Object.entries(parent)
  const index = entries.findIndex(([name]) => name === lastSegment.name)
  const nextEntries = entries.filter(([name]) => name !== lastSegment.name)
  const updatedParent = Object.fromEntries(nextEntries)
  const nextSchema = path.length === 1 ? updatedParent : setSchemaValue(schema, path.slice(0, -1), updatedParent)
  const nextName = nextEntries[Math.min(index, nextEntries.length - 1)]?.[0]
  return { schema: nextSchema, path: nextName ? pathForField(path.slice(0, -1), nextName) : path.slice(0, -1) }
}

export const duplicateSchemaField = (schema: Schema, path: FieldPath): { schema: Schema; path: FieldPath } => {
  const lastSegment = path.at(-1)
  const parent = getParentSchema(schema, path)
  if (lastSegment?.kind !== 'field' || !parent || !Object.hasOwn(parent, lastSegment.name)) return { schema, path }

  const result = duplicateField(parent, lastSegment.name)
  const nextSchema = path.length === 1 ? result.schema : setSchemaValue(schema, path.slice(0, -1), result.schema)
  return { schema: nextSchema, path: pathForField(path.slice(0, -1), result.name) }
}

export const moveSchemaField = (schema: Schema, path: FieldPath, offset: -1 | 1): Schema => {
  const lastSegment = path.at(-1)
  const parent = getParentSchema(schema, path)
  if (lastSegment?.kind !== 'field' || !parent || !Object.hasOwn(parent, lastSegment.name)) return schema

  const moved = moveField(parent, lastSegment.name, offset)
  return path.length === 1 ? moved : setSchemaValue(schema, path.slice(0, -1), moved)
}
