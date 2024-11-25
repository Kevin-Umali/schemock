// src/lib/schema.ts
import { TreeNode } from '@/types/tree'
import { isArrayNode, isObjectNode } from '@/lib/tree'

export const convertToSchema = (nodes: TreeNode[]): { schema: Record<string, unknown> } => {
  const convert = (node: TreeNode): unknown => {
    if (isArrayNode(node)) {
      if (node.arrayItemType === 'object' && node.children) {
        const childSchema = node.children.reduce(
          (acc, child) => {
            acc[child.name] = convert(child)
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
        items: node.fakerMethod,
        count: node.count,
      }
    }

    if (isObjectNode(node)) {
      return node.children.reduce(
        (acc, child) => {
          acc[child.name] = convert(child)
          return acc
        },
        {} as Record<string, unknown>,
      )
    }

    return node.fakerMethod
  }

  // Only process root nodes
  const rootNodes = nodes.filter((node) => node.isRoot)

  // Combine all root nodes into a single schema
  const schema = rootNodes.reduce(
    (acc, node) => {
      acc[node.name] = convert(node)
      return acc
    },
    {} as Record<string, unknown>,
  )

  return { schema }
}
