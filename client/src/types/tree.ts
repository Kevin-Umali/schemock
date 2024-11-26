// src/types/tree.ts

import { BASE_TYPES } from '@/constants'

export type BaseType = (typeof BASE_TYPES)[number]
export type NodeDataType = BaseType | string
export type FakerFunction = string
export type NodeLocale = string

interface NodeBase {
  id: string
  label: string // Renamed from "name"
  dataType: NodeDataType // Renamed from "type"
  fakerFunction?: FakerFunction // Renamed from "fakerMethod"
  fakerFunctionArgs?: Record<string, unknown>
  isRootNode?: boolean // Renamed from "isRoot"
  locale?: NodeLocale
}

export interface PrimitiveNode extends NodeBase {
  dataType: Exclude<NodeDataType, BaseType>
}

export interface ObjectNode extends NodeBase {
  dataType: 'object'
  children: TreeDataNode[]
}

export interface ArrayNode extends NodeBase {
  dataType: 'array'
  itemDataType: NodeDataType // Renamed from "arrayItemType"
  count: number
  children?: TreeDataNode[]
  fakerFunction?: FakerFunction
}

export type TreeDataNode = PrimitiveNode | ObjectNode | ArrayNode

export type NodeUpdateType =
  | 'label' // Renamed from "name"
  | 'dataType' // Renamed from "type"
  | 'fakerFunction' // Renamed from "fakerMethod"
  | 'itemDataType' // Renamed from "arrayItemType"
  | 'count'
  | 'add'
  | 'delete'
  | 'children'

export interface TreeViewOptions {
  nodes: TreeDataNode[] // Updated from TreeNode[]
  onChange: (nodes: TreeDataNode[]) => void // Updated from TreeNode[]
  renderNode?: (
    node: TreeDataNode, // Updated from TreeNode
    handleUpdate: (id: string, label: string) => void,
  ) => React.ReactNode
  allowAdd?: boolean
  allowDelete?: boolean
  defaultExpanded?: boolean
  onNodeUpdate?: (
    node: TreeDataNode, // Updated from TreeNode
    updateType: NodeUpdateType,
    details?: unknown,
  ) => void
  onNodeSelect?: (node: TreeDataNode) => void // Updated from TreeNode
  onNodeExpand?: (node: TreeDataNode, isExpanded: boolean) => void // Updated from TreeNode
  onNodeAdd?: (
    parentNode: TreeDataNode | null, // Updated from TreeNode
    newNode: TreeDataNode, // Updated from TreeNode
  ) => void
  onNodeDelete?: (node: TreeDataNode) => void // Updated from TreeNode
  onNodeRename?: (node: TreeDataNode, newLabel: string) => void // Updated from TreeNode
  canAddNode?: (parentNode: TreeDataNode | null) => boolean // Updated from TreeNode
  canDeleteNode?: (node: TreeDataNode) => boolean // Updated from TreeNode
  canRenameNode?: (node: TreeDataNode, newLabel: string) => boolean // Updated from TreeNode
}

export interface GeneratedSchema {
  schema: Record<string, unknown>
  count: number
  locale: string
}

export interface FakerMethodItem {
  method: string
  description: string
  parameters: string
  example: string
}

export interface FakerMethodCategory {
  category: string
  description: string
  items: FakerMethodItem[]
}
