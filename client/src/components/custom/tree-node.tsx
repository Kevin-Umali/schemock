// src/components/custom/tree-node.tsx

import React, { memo, useState, useCallback, useId } from 'react'
import { ChevronRightIcon } from 'lucide-react'
import TreeNodeControls from '@/components/custom/tree-node-controls'
import TreeNodeActions from '@/components/custom/tree-node-actions'
import { TreeDataNode, TreeViewOptions, NodeDataType, FakerFunction } from '@/types/tree'
import { Button } from '@/components/ui/button'
import { hasChildren } from '@/lib/tree'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

interface TreeNodeProps {
  node: TreeDataNode
  level: number
  isLast: boolean
  handleLabelChange: (id: string, label: string) => void
  handleDataTypeChange: (id: string, type: NodeDataType) => void
  handleFakerFunctionChange: (id: string, method: FakerFunction) => void
  handleItemDataTypeChange: (id: string, type: NodeDataType) => void
  handleCountChange: (id: string, count: number) => void
  handleAddChild: (parentId: string) => void
  handleDelete: (id: string) => void
  renderNode?: TreeViewOptions['renderNode']
  allowAdd?: boolean
  allowDelete?: boolean
  defaultExpanded?: boolean
  onNodeSelect?: TreeViewOptions['onNodeSelect']
  onNodeExpand?: TreeViewOptions['onNodeExpand']
  onNodeAdd?: TreeViewOptions['onNodeAdd']
  onNodeDelete?: TreeViewOptions['onNodeDelete']
  onNodeRename?: TreeViewOptions['onNodeRename']
  canAddNode?: TreeViewOptions['canAddNode']
  canDeleteNode?: TreeViewOptions['canDeleteNode']
  canRenameNode?: TreeViewOptions['canRenameNode']
}

const TreeNode: React.FC<TreeNodeProps> = memo(
  ({
    node,
    level,
    isLast,
    handleLabelChange,
    handleDataTypeChange,
    handleFakerFunctionChange,
    handleItemDataTypeChange,
    handleCountChange,
    handleAddChild,
    handleDelete,
    renderNode,
    allowAdd = false,
    allowDelete = false,
    defaultExpanded = true,
    onNodeSelect,
    onNodeExpand,
    onNodeAdd,
    onNodeDelete,
    onNodeRename,
    canAddNode,
    canDeleteNode,
    canRenameNode,
    ...props
  }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded)
    const nodeId = useId()

    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => {
        const newState = !prev
        onNodeExpand?.(node, newState)
        return newState
      })
    }, [node, onNodeExpand])

    const handleSelect = useCallback(() => {
      onNodeSelect?.(node)
    }, [node, onNodeSelect])

    const handleNodeLabelChange = useCallback(
      (id: string, newLabel: string) => {
        if (canRenameNode && !canRenameNode(node, newLabel)) return
        handleLabelChange(id, newLabel)
        onNodeRename?.(node, newLabel)
      },
      [node, handleLabelChange, onNodeRename, canRenameNode],
    )

    const handleNodeAdd = useCallback(() => {
      if (canAddNode && !canAddNode(node)) return
      handleAddChild(node.id)
      onNodeAdd?.(node, {
        id: `${node.id}-${Date.now()}`,
        label: 'New Node',
        dataType: 'string',
      } as TreeDataNode)
    }, [node, handleAddChild, onNodeAdd, canAddNode])

    const handleNodeDelete = useCallback(() => {
      if (canDeleteNode && !canDeleteNode(node)) return
      handleDelete(node.id)
      onNodeDelete?.(node)
    }, [node, handleDelete, onNodeDelete, canDeleteNode])

    const showChildren = hasChildren(node) && isExpanded && node.children && node.children.length > 0

    return (
      <motion.li
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative',
          level > 0 && 'ml-2 sm:ml-5 border-l border-border',
          isLast && level > 0 && 'border-l-0',
          level > 0 && node.dataType === 'object' && 'before:absolute before:top-[16px] before:left-0 before:w-3 sm:before:w-2 before:h-px before:bg-border',
          node.dataType !== 'object' && 'before:absolute before:top-[16px] before:left-0 before:w-3 sm:before:w-5 before:h-px before:bg-border',
          !isLast && level > 0 && 'after:absolute after:top-[16px] after:left-[-1px] after:w-px after:h-full after:bg-border',
        )}
        role='treeitem'
        aria-expanded={hasChildren(node) ? isExpanded : undefined}
        id={nodeId}
      >
        <div className='flex items-start py-2 group'>
          <Button
            variant='ghost'
            onClick={toggleExpand}
            className={cn('flex-shrink-0 w-6 h-6 hover:bg-transparent flex items-center justify-center rounded-md transition-colors', {
              'cursor-default opacity-50': !hasChildren(node),
              'hover:bg-gray-100': hasChildren(node),
            })}
          >
            {hasChildren(node) && <ChevronRightIcon className={cn('w-4 h-4 transition-transform duration-200 ease-in-out', isExpanded && 'rotate-90')} />}
          </Button>

          <motion.div className='flex-1 min-w-0 px-2' onClick={handleSelect} whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
            {renderNode ? (
              renderNode(node, handleNodeLabelChange)
            ) : (
              <TreeNodeControls
                node={node}
                handleLabelChange={handleNodeLabelChange}
                handleDataTypeChange={handleDataTypeChange}
                handleFakerFunctionChange={handleFakerFunctionChange}
                handleItemDataTypeChange={handleItemDataTypeChange}
                handleCountChange={handleCountChange}
              />
            )}
          </motion.div>

          <TreeNodeActions
            node={node}
            allowAdd={allowAdd}
            allowDelete={allowDelete}
            handleAddChild={handleNodeAdd}
            handleDelete={handleNodeDelete}
            canAddNode={canAddNode}
            canDeleteNode={canDeleteNode}
          />
        </div>

        <AnimatePresence>
          {hasChildren(node) && node.children && showChildren && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: {
                  height: {
                    duration: 0.3,
                    ease: 'easeInOut',
                  },
                  opacity: {
                    duration: 0.2,
                    delay: 0.1,
                  },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: 'easeInOut',
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              }}
              role='group'
              aria-labelledby={nodeId}
              className='overflow-hidden'
            >
              {node.children.map((child, index) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  level={level + 1}
                  isLast={index === (node.children?.length ?? 0) - 1}
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
                  {...props}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.li>
    )
  },
)

TreeNode.displayName = 'TreeNode'

export default TreeNode
