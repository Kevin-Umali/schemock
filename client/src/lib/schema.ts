// src/lib/schema.ts
import { TreeDataNode } from '@/types/tree'
import { isArrayNode, isObjectNode } from '@/lib/tree'

export const convertToSchema = (nodes: TreeDataNode[]): { schema: Record<string, unknown> } => {
  const convert = (node: TreeDataNode): unknown => {
    if (isArrayNode(node)) {
      if (node.itemDataType === 'object' && node.children) {
        const childSchema = node.children.reduce(
          (acc, child) => {
            acc[child.label] = convert(child) // Updated from `child.name`
            return acc
          },
          {} as Record<string, unknown>,
        )

        return {
          items: childSchema,
          count: node.count,
        }
      }

      return {
        items: node.fakerFunction, // Updated from `node.fakerMethod`
        count: node.count,
      }
    }

    if (isObjectNode(node)) {
      return node.children.reduce(
        (acc, child) => {
          acc[child.label] = convert(child) // Updated from `child.name`
          return acc
        },
        {} as Record<string, unknown>,
      )
    }

    return node.fakerFunction // Updated from `node.fakerMethod`
  }

  // Only process root nodes
  const rootNodes = nodes.filter((node) => node.isRootNode) // Updated from `node.isRoot`

  // Combine all root nodes into a single schema
  const schema = rootNodes.reduce(
    (acc, node) => {
      acc[node.label] = convert(node) // Updated from `node.name`
      return acc
    },
    {} as Record<string, unknown>,
  )

  return { schema }
}
