// src/components/custom/tree-node-actions.tsx

import React from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { TreeDataNode } from '@/types/tree'
import { Button } from '@/components/ui/button'
import { isArrayNode } from '@/lib/tree'
import { cn } from '@/lib/utils'

interface TreeNodeActionsProps {
  node: TreeDataNode
  allowAdd: boolean
  allowDelete: boolean
  handleAddChild: (parentId: string) => void
  handleDelete: (id: string) => void
  canAddNode?: (node: TreeDataNode) => boolean
  canDeleteNode?: (node: TreeDataNode) => boolean
}

const TreeNodeActions: React.FC<TreeNodeActionsProps> = ({ node, allowAdd, allowDelete, handleAddChild, handleDelete, canAddNode, canDeleteNode }) => {
  const canShowAddButton = node.dataType === 'object' || (isArrayNode(node) && node.itemDataType === 'object')
  const canShowDeleteButton = !node.isRootNode

  return (
    <div
      className={cn(
        'flex-shrink-0 flex items-start gap-1',
        'transition-all duration-200 ease-in-out',
        'opacity-100 sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0',
      )}
    >
      {allowAdd && canShowAddButton && (!canAddNode || canAddNode(node)) && (
        <Button
          variant='outline'
          size='icon'
          onClick={() => handleAddChild(node.id)}
          className='w-6 h-6 rounded-md transition-all duration-200 hover:bg-emerald-50 hover:border-emerald-200 active:scale-95'
        >
          <PlusIcon className='w-4 h-4 text-emerald-500' />
        </Button>
      )}
      {allowDelete && canShowDeleteButton && (!canDeleteNode || canDeleteNode(node)) && (
        <Button
          variant='outline'
          size='icon'
          onClick={() => handleDelete(node.id)}
          className='w-6 h-6 rounded-md transition-all duration-200 hover:bg-red-50 hover:border-red-200 active:scale-95'
        >
          <TrashIcon className='w-4 h-4 text-red-500' />
        </Button>
      )}
    </div>
  )
}

TreeNodeActions.displayName = 'TreeNodeActions'

export default TreeNodeActions
