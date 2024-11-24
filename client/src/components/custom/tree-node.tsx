// src/components/custom/tree-node.tsx

import React, { useState, memo, useId, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRightIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TreeNode, TreeViewProps, DataType, FakerMethod } from '@/types/tree'

import { getFakerCategories, getFakerMethodsByCategory, hasChildren, isArrayNode } from '@/lib/tree'
import { Button } from '@/components/ui/button'
import { useRouteContext } from '@tanstack/react-router'
import { BASE_TYPES } from '@/constants'

interface TreeNodeComponentProps {
  node: TreeNode
  level: number
  isLast: boolean
  handleNameChange: (id: string, name: string) => void
  handleTypeChange: (id: string, type: DataType) => void
  handleFakerMethodChange: (id: string, method: FakerMethod) => void
  handleArrayItemTypeChange: (id: string, type: DataType) => void
  handleCountChange: (id: string, count: number) => void
  handleAddChild: (parentId: string) => void
  handleDelete: (id: string) => void
  renderNode?: TreeViewProps['renderNode']
  allowAdd?: boolean
  allowDelete?: boolean
  defaultExpanded?: boolean
  onNodeSelect?: TreeViewProps['onNodeSelect']
  onNodeExpand?: TreeViewProps['onNodeExpand']
  onNodeAdd?: TreeViewProps['onNodeAdd']
  onNodeDelete?: TreeViewProps['onNodeDelete']
  onNodeRename?: TreeViewProps['onNodeRename']
  canAddNode?: TreeViewProps['canAddNode']
  canDeleteNode?: TreeViewProps['canDeleteNode']
  canRenameNode?: TreeViewProps['canRenameNode']
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = memo(
  ({
    node,
    level,
    isLast,
    handleNameChange,
    handleTypeChange,
    handleFakerMethodChange,
    handleArrayItemTypeChange,
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
  }) => {
    const fakerMethods = useRouteContext({
      from: '/',
      select: (state) => state.fakerMethods,
    })

    const categories = useMemo(() => getFakerCategories(fakerMethods), [fakerMethods])

    // Use type guard to get array item type
    const getNodeType = (node: TreeNode): DataType => {
      if (isArrayNode(node)) {
        return node.arrayItemType
      }
      return node.type
    }

    const availableMethods = useMemo(() => {
      const type = getNodeType(node)
      if (type === 'object' || type === 'array') {
        return []
      }
      return getFakerMethodsByCategory(fakerMethods, type)
    }, [node, fakerMethods])

    const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded)
    const nodeId = useId()

    const showChildren = hasChildren(node) && isExpanded && node.children && node.children.length > 0
    const canShowAddButton = node.type === 'object' || (isArrayNode(node) && node.arrayItemType === 'object')
    const canShowDeleteButton = !node.isRoot

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

    const handleNodeNameChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value
        if (canRenameNode && !canRenameNode(node, newName)) return
        handleNameChange(node.id, newName)
        onNodeRename?.(node, newName)
      },
      [node, handleNameChange, onNodeRename, canRenameNode],
    )

    const handleNodeDelete = useCallback(() => {
      if (canDeleteNode && !canDeleteNode(node)) return
      handleDelete(node.id)
      onNodeDelete?.(node)
    }, [node, handleDelete, onNodeDelete, canDeleteNode])

    const handleNodeAdd = useCallback(() => {
      if (canAddNode && !canAddNode(node)) return
      handleAddChild(node.id)
      onNodeAdd?.(node, {
        id: `${node.id}-${Date.now()}`,
        name: 'New Node',
        type: 'string',
      })
    }, [node, handleAddChild, onNodeAdd, canAddNode])

    const renderControls = () => (
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
          {/* Name Input */}
          <Input value={node.name} onChange={handleNodeNameChange} className='h-8 w-full' placeholder='Property Name' />

          {/* Type Select */}
          <Select
            value={node.type}
            onValueChange={(value) => {
              handleTypeChange(node.id, value as DataType)
              // Reset the faker method
              // handleFakerMethodChange(node.id, '')
            }}
          >
            <SelectTrigger className='h-8 w-full sm:w-[180px]'>
              <SelectValue placeholder='Select Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Base Types</SelectLabel>
                {BASE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Faker Categories</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Array Count Input */}
          {isArrayNode(node) && (
            <Input
              type='number'
              min={1}
              max={100}
              value={node.count}
              onChange={(e) => handleCountChange(node.id, parseInt(e.target.value) ?? 1)}
              className='h-8 w-full sm:w-[100px]'
              placeholder='Count'
            />
          )}

          {/* Array Item Type Select */}
          {isArrayNode(node) && (
            <Select value={node.arrayItemType} onValueChange={(value) => handleArrayItemTypeChange(node.id, value as DataType)}>
              <SelectTrigger className='h-8 w-full sm:w-[180px]'>
                <SelectValue placeholder='Item Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Base Types</SelectLabel>
                  {BASE_TYPES.filter((type) => type !== 'array').map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Faker Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Faker Method Select - Full width */}
        {availableMethods.length > 0 && node.type !== 'object' && node.type !== 'array' && (
          <Select value={node.fakerMethod ?? ''} onValueChange={(value) => handleFakerMethodChange(node.id, value as FakerMethod)}>
            <SelectTrigger className='h-8 w-full sm:w-[300px]'>
              <SelectValue placeholder='Select Faker Method' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Methods</SelectLabel>
                {availableMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
    )

    return (
      <li
        className={cn(
          'relative',
          level > 0 && 'ml-2 sm:ml-5 border-l border-gray-200',
          isLast && level > 0 && 'border-l-0',
          level > 0 && 'before:absolute before:top-[16px] before:left-0 before:w-3 sm:before:w-5 before:h-px before:bg-gray-200',
          !isLast && level > 0 && 'after:absolute after:top-[16px] after:left-[-1px] after:w-px after:h-full after:bg-gray-200',
        )}
        role='treeitem'
        aria-expanded={hasChildren(node) ? isExpanded : undefined}
        id={nodeId}
      >
        <div className='flex items-start py-2 group'>
          <Button variant='ghost' onClick={toggleExpand} className='flex-shrink-0 w-6 h-6 mt-1 flex items-center justify-center rounded-md transition-colors'>
            {hasChildren(node) && <ChevronRightIcon className={cn('w-4 h-4 transition-transform duration-200 ease-in-out', isExpanded && 'rotate-90')} />}
          </Button>

          <div className='flex-1 min-w-0 px-2' onClick={handleSelect}>
            {renderNode ? renderNode(node, handleNameChange) : renderControls()}
          </div>

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
                onClick={handleNodeAdd}
                className='w-6 h-6 rounded-md transition-all duration-200 hover:bg-emerald-50 hover:border-emerald-200 active:scale-95'
              >
                <PlusIcon className='w-4 h-4 text-emerald-500' aria-hidden='true' />
              </Button>
            )}
            {allowDelete && canShowDeleteButton && (!canDeleteNode || canDeleteNode(node)) && (
              <Button
                variant='outline'
                size='icon'
                onClick={handleNodeDelete}
                className='w-6 h-6 rounded-md transition-all duration-200 hover:bg-red-50 hover:border-red-200 active:scale-95'
              >
                <TrashIcon className='w-4 h-4 text-red-500' aria-hidden='true' />
              </Button>
            )}
          </div>
        </div>

        {hasChildren(node) && node.children && showChildren && (
          <ul
            role='group'
            aria-labelledby={nodeId}
            className={cn('transition-all duration-200 ease-in-out', showChildren ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden')}
          >
            {node.children.map((child, index) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isLast={index === node.children!.length - 1}
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
        )}
      </li>
    )
  },
)

TreeNodeComponent.displayName = 'TreeNodeComponent'

export default TreeNodeComponent
