// src/components/custom/tree-view.tsx

import React, { useCallback } from 'react'
import { TreeDataNode, TreeViewOptions, NodeDataType, FakerFunction, ArrayNode } from '@/types/tree'
import { updateNodeInTree, createNode, isArrayNode } from '@/lib/tree'
import TreeNode from './tree-node'

const TreeView: React.FC<TreeViewOptions> = ({
  nodes,
  onChange,
  renderNode,
  allowAdd = false,
  allowDelete = false,
  defaultExpanded = true,
  onNodeUpdate,
  onNodeSelect,
  onNodeExpand,
  onNodeAdd,
  onNodeDelete,
  onNodeRename,
  canAddNode,
  canDeleteNode,
  canRenameNode,
}) => {
  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        const updatedNode = { ...node, label }
        onNodeUpdate?.(updatedNode, 'label', { previousLabel: node.label })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeUpdate],
  )

  const handleDataTypeChange = useCallback(
    (id: string, dataType: NodeDataType) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        const baseProps = {
          id: node.id,
          label: node.label,
          dataType,
          isRootNode: node.isRootNode,
        }

        if (dataType === 'object') {
          return {
            ...baseProps,
            children: [],
          }
        } else if (dataType === 'array') {
          return {
            ...baseProps,
            itemDataType: 'object',
            count: 1,
            children: [],
          }
        } else {
          return {
            ...baseProps,
            fakerFunction: undefined,
          }
        }
      })
      onChange(updatedNodes)
      onNodeUpdate?.(updatedNodes[0], 'dataType')
    },
    [nodes, onChange, onNodeUpdate],
  )

  const handleFakerFunctionChange = useCallback(
    (id: string, method: FakerFunction, dataType: NodeDataType) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        const updatedNode = { ...node, fakerFunction: method, ...(isArrayNode(node) ? { itemDataType: dataType } : { dataType }) }
        onNodeUpdate?.(updatedNode, 'fakerFunction', { previousMethod: node.fakerFunction })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeUpdate],
  )

  const handleItemDataTypeChange = useCallback(
    (id: string, dataType: NodeDataType) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        if (!isArrayNode(node)) return node

        const updatedNode = {
          ...node,
          itemDataType: dataType,
          children: dataType === 'object' ? [] : undefined,
          fakerFunction: undefined,
        } as ArrayNode

        onNodeUpdate?.(updatedNode, 'itemDataType')
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeUpdate],
  )

  const handleCountChange = useCallback(
    (id: string, count: number) => {
      const updatedNodes = updateNodeInTree(nodes, id, (node) => {
        if (!isArrayNode(node)) return node

        const updatedNode = { ...node, count }
        onNodeUpdate?.(updatedNode, 'count', { previousCount: node.count })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeUpdate],
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
        onNodeUpdate?.(newNode, 'add', { parentNode: node })
        return updatedNode
      })
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeUpdate],
  )

  const handleDelete = useCallback(
    (id: string) => {
      let deletedNode: TreeDataNode | undefined
      const deleteNode = (nodes: TreeDataNode[]): TreeDataNode[] => {
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
        onNodeUpdate?.(deletedNode, 'delete')
      }
      onChange(updatedNodes)
    },
    [nodes, onChange, onNodeUpdate],
  )

  return (
    <ul role='tree' className='tree-view'>
      {nodes.map((node, index) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          isLast={index === nodes.length - 1}
          handleLabelChange={handleLabelChange}
          handleDataTypeChange={handleDataTypeChange}
          handleFakerFunctionChange={handleFakerFunctionChange}
          handleItemDataTypeChange={handleItemDataTypeChange}
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

TreeView.displayName = 'TreeView'

export default TreeView
