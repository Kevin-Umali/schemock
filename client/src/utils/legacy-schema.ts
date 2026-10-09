import type { TreeDataNode } from '@/types/legacy-schema'
/** Decode schemas saved by the original tree editor without trusting node shapes. */
export const convertToSchema = (
  nodes: TreeDataNode[],
): {
  schema: Record<string, unknown>
} => {
  const convertList = (list: TreeDataNode[], depth: number): Record<string, unknown> => {
    if (depth > 12 || list.length > 100) throw new Error('This shared schema is too large or deeply nested.')
    return Object.fromEntries(
      list.map((node) => {
        if (!node || typeof node.label !== 'string' || ['__proto__', 'constructor', 'prototype'].includes(node.label))
          throw new Error('This shared schema contains an invalid field.')
        if (node.dataType === 'object') return [node.label, convertList(node.children ?? [], depth + 1)]
        if (node.dataType === 'array')
          return [
            node.label,
            {
              items: node.itemDataType === 'object' ? convertList(node.children ?? [], depth + 1) : node.fakerFunction,
              count: node.count,
            },
          ]
        return [node.label, node.fakerFunction]
      }),
    )
  }
  return {
    schema: convertList(
      nodes.filter((node) => node?.isRootNode),
      0,
    ),
  }
}
