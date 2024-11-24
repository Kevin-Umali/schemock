// src/components/custom/tree-view.tsx

import React, { useCallback } from 'react'
import { TreeNode, TreeViewProps, DataType, FakerMethod, ArrayNode } from '@/types/tree'
import { updateNodeInTree, createNode, isArrayNode } from '@/lib/tree'
import TreeNodeComponent from './tree-node'

const TreeView: React.FC<TreeViewProps> = ({
  nodes,
  onChange,
  renderNode,
  allowAdd = false,
  allowDelete = false,
  defaultExpanded = true,
  onNodeChange,
  onNodeSelect,
  onNodeExpand,
  onNodeAdd,
  onNodeDelete,
  onNodeRename,
  canAddNode,
  canDeleteNode,
  canRenameNode,
}) => {
  const handleNameChange = useCallback(
    (id: string, name: string) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        const updatedNode = { ...node, name }
        onNodeChange?.(updatedNode, 'name', { previousName: node.name })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeChange],
  )

  const handleTypeChange = useCallback(
    (id: string, type: DataType) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        // Create base properties
        const baseProps = {
          id: node.id,
          name: node.name,
          type,
          isRoot: node.isRoot,
        }

        // Handle conversion to different types
        if (type === 'object') {
          return {
            ...baseProps,
            children: [],
          }
        } else if (type === 'array') {
          return {
            ...baseProps,
            arrayItemType: 'object', // default to object
            count: 1,
            children: [],
          }
        } else {
          // For faker categories
          return {
            ...baseProps,
            fakerMethod: undefined, // Reset faker method when type changes
          }
        }
      })
      onChange(updatedNodes)
      onNodeChange?.(updatedNodes[0], 'type')
    },
    [nodes, onChange, onNodeChange],
  )

  const handleFakerMethodChange = useCallback(
    (id: string, method: FakerMethod) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        const updatedNode = { ...node, fakerMethod: method }
        onNodeChange?.(updatedNode, 'fakerMethod', { previousMethod: node.fakerMethod })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeChange],
  )

  const handleArrayItemTypeChange = useCallback(
    (id: string, type: DataType) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        if (!isArrayNode(node)) return node

        const updatedNode = {
          ...node,
          arrayItemType: type,
          children: type === 'object' ? [] : undefined,
          fakerMethod: undefined,
        } as ArrayNode

        onNodeChange?.(updatedNode, 'arrayItemType')
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeChange],
  )

  const handleCountChange = useCallback(
    (id: string, count: number) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        if (!isArrayNode(node)) return node

        const updatedNode = { ...node, count }
        onNodeChange?.(updatedNode, 'count', { previousCount: node.count })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeChange],
  )

  const handleAddChild = useCallback(
    (parentId: string) => {
      const updatedNodes = updateNodeInTree(nodes, parentId, (node) => {
        if (!('children' in node)) return node
        const newNode = createNode(node.id)
        const children = node.children || []
        const updatedNode = {
          ...node,
          children: [...children, newNode],
        }
        onNodeChange?.(newNode, 'add', { parentNode: node })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeChange],
  )

  const handleDelete = useCallback(
    (id: string) => {
      let deletedNode: TreeNode | undefined
      const deleteNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes
          .filter((node) => {
            if (node.id === id) {
              deletedNode = node
              return false
            }
            return true
          })
          .map((node) => {
            if ('children' in node && node.children) {
              return { ...node, children: deleteNode(node.children) }
            }
            return node
          })
      }
      const updatedNodes = deleteNode(nodes)
      if (deletedNode) {
        onNodeChange?.(deletedNode, 'delete')
      }
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeChange],
  )

  return (
    <ul role='tree' className='tree-view'>
      {nodes.map((node, index) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          isLast={index === nodes.length - 1}
          handleNameChange={handleNameChange}
          handleTypeChange={handleTypeChange}
          handleFakerMethodChange={handleFakerMethodChange}
          handleArrayItemTypeChange={handleArrayItemTypeChange}
          handleCountChange={handleCountChange}
          handleAddChild={handleAddChild}
          handleDelete={handleDelete}
          renderNode={renderNode}
          allowAdd={allowAdd}
          allowDelete={allowDelete}
          defaultExpanded={defaultExpanded}
          onNodeSelect={onNodeSelect}
          onNodeExpand={onNodeExpand}
          onNodeAdd={onNodeAdd}
          onNodeDelete={onNodeDelete}
          onNodeRename={onNodeRename}
          canAddNode={canAddNode}
          canDeleteNode={canDeleteNode}
          canRenameNode={canRenameNode}
        />
      ))}
    </ul>
  )
}

export default TreeView
