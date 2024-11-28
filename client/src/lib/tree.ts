import { TreeDataNode, NodeDataType, ArrayNode, ObjectNode, PrimitiveNode, FakerMethodCategory } from '@/types/tree'

export const isObjectNode = (node: TreeDataNode): node is ObjectNode => {
  return node.dataType === 'object'
}

export const isArrayNode = (node: TreeDataNode): node is ArrayNode => {
  return node.dataType === 'array'
}

export const isPrimitiveNode = (node: TreeDataNode): node is PrimitiveNode => {
  return !isObjectNode(node) && !isArrayNode(node)
}

export const hasChildren = (node: TreeDataNode): node is ObjectNode | ArrayNode => {
  return isObjectNode(node) || (isArrayNode(node) && node.itemDataType === 'object')
}

export const createNode = (parentId: string | null, dataType: NodeDataType = 'string', isRoot = false): TreeDataNode => {
  const baseProps = {
    id: `${parentId ? parentId + '-' : ''}${Date.now()}`,
    label: 'New Node',
    dataType,
    isRootNode: isRoot,
    ...(isRoot ? { locale: 'en' as const } : {}),
  }

  switch (dataType) {
    case 'object':
      return {
        ...baseProps,
        dataType: 'object',
        children: [],
      }
    case 'array':
      return {
        ...baseProps,
        dataType: 'array',
        itemDataType: 'string',
        count: 1,
        children: [],
      }
    default:
      return {
        ...baseProps,
        dataType,
      } as PrimitiveNode
  }
}

export const updateNodeInTree = (nodes: TreeDataNode[], nodeId: string, updater: (node: TreeDataNode) => TreeDataNode): TreeDataNode[] => {
  let isUpdated = false
  const updatedNodes = nodes.map((node) => {
    if (node.id === nodeId) {
      isUpdated = true
      return updater(node)
    }
    if (hasChildren(node) && node.children) {
      const updatedChildren = updateNodeInTree(node.children, nodeId, updater)
      if (updatedChildren !== node.children) {
        isUpdated = true
        return {
          ...node,
          children: updatedChildren,
        }
      }
    }
    return node
  })
  return isUpdated ? updatedNodes : nodes
}

export const cleanupNodeLocale = (node: TreeDataNode): TreeDataNode => {
  const cleanedNode = { ...node }
  if (!node.isRootNode) {
    delete cleanedNode.locale
  }
  if ('children' in cleanedNode && cleanedNode.children) {
    cleanedNode.children = cleanedNode.children.map(cleanupNodeLocale)
  }
  return cleanedNode
}

export const getNodeFakerMethods = (node: TreeDataNode, fakerMethods: FakerMethodCategory[]): string[] => {
  if (isArrayNode(node)) {
    const itemType = node.itemDataType
    if (itemType !== 'object' && itemType !== 'array') {
      return getFakerMethodsByCategory(fakerMethods, itemType)
    }
    return []
  }

  if (node.dataType !== 'object' && node.dataType !== 'array') {
    return getFakerMethodsByCategory(fakerMethods, node.dataType)
  }

  return []
}

export const getFakerCategories = (
  fakerMethods: Array<{
    category: string
    description: string
    items: Array<{
      method: string
      description: string
      parameters: string
      example: string
    }>
  }>,
): string[] => {
  return fakerMethods.map((method) => method.category).sort((a, b) => a.localeCompare(b))
}

export const getFakerMethodsByCategory = (
  fakerMethods: Array<{
    category: string
    description: string
    items: Array<{
      method: string
      description: string
      parameters: string
      example: string
    }>
  }>,
  category: string,
): string[] => {
  const categoryMethods = fakerMethods.find((m) => m.category === category)
  return categoryMethods?.items.map((item) => item.method).sort((a, b) => a.localeCompare(b)) ?? []
}
