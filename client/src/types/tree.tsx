// src/types/tree.ts

import { BASE_TYPES } from '@/constants'

export type BaseType = (typeof BASE_TYPES)[number]
export type DataType = BaseType | string
export type FakerMethod = string
export type Locale = string

interface BaseNode {
  id: string
  name: string
  type: DataType
  fakerMethod?: FakerMethod
  fakerMethodArgs?: Record<string, unknown>
  isRoot?: boolean
  locale?: Locale
}

export interface PrimitiveNode extends BaseNode {
  type: Exclude<DataType, BaseType>
}

export interface ObjectNode extends BaseNode {
  type: 'object'
  children: TreeNode[]
}

export interface ArrayNode extends BaseNode {
  type: 'array'
  arrayItemType: DataType
  count: number
  children?: TreeNode[]
  fakerMethod?: FakerMethod
}

export type TreeNode = PrimitiveNode | ObjectNode | ArrayNode

export type NodeChangeType = 'name' | 'type' | 'fakerMethod' | 'arrayItemType' | 'count' | 'add' | 'delete' | 'children'

export interface TreeViewProps {
  nodes: TreeNode[]
  onChange: (nodes: TreeNode[]) => void
  renderNode?: (node: TreeNode, handleChange: (id: string, name: string) => void) => React.ReactNode
  allowAdd?: boolean
  allowDelete?: boolean
  defaultExpanded?: boolean
  onNodeChange?: (node: TreeNode, changeType: NodeChangeType, details?: unknown) => void
  onNodeSelect?: (node: TreeNode) => void
  onNodeExpand?: (node: TreeNode, isExpanded: boolean) => void
  onNodeAdd?: (parentNode: TreeNode | null, newNode: TreeNode) => void
  onNodeDelete?: (node: TreeNode) => void
  onNodeRename?: (node: TreeNode, newName: string) => void
  canAddNode?: (parentNode: TreeNode | null) => boolean
  canDeleteNode?: (node: TreeNode) => boolean
  canRenameNode?: (node: TreeNode, newName: string) => boolean
}
