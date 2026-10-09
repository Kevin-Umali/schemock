import type { TreeDataNode } from '@/types/legacy-schema'
import { SCHEMA_LIMITS } from '@/constants/schema-editor'
import { assertSchemaDepth } from '@/utils/schema-depth'
import { appendSchemaPath } from '@/utils/schema-path'
/** Decode schemas saved by the original tree editor without trusting node shapes. */
export const convertToSchema = (
  nodes: TreeDataNode[],
): {
  schema: Record<string, unknown>
} => {
  const convertList = (list: TreeDataNode[], depth: number, path: string): Record<string, unknown> => {
    assertSchemaDepth(depth, path)
    if (list.length > SCHEMA_LIMITS.fields) throw new Error('This shared schema has too many fields.')
    return Object.fromEntries(
      list.map((node) => {
        if (!node || typeof node.label !== 'string' || ['__proto__', 'constructor', 'prototype'].includes(node.label))
          throw new Error('This shared schema contains an invalid field.')
        const fieldPath = appendSchemaPath(path, node.label)
        assertSchemaDepth(depth + 1, fieldPath)
        if (node.dataType === 'object') return [node.label, convertList(node.children ?? [], depth + 1, fieldPath)]
        if (node.dataType === 'array') {
          assertSchemaDepth(depth + 2, `${fieldPath}[]`)
          return [
            node.label,
            {
              items:
                node.itemDataType === 'object'
                  ? convertList(node.children ?? [], depth + 2, `${fieldPath}[]`)
                  : node.fakerFunction,
              count: node.count,
            },
          ]
        }
        return [node.label, node.fakerFunction]
      }),
    )
  }
  return {
    schema: convertList(
      nodes.filter((node) => node?.isRootNode),
      0,
      '$',
    ),
  }
}
