// src/components/custom/tree-node-controls.tsx

import { Input } from '@/components/ui/input'
import { TreeDataNode, NodeDataType, FakerFunction, BaseType } from '@/types/tree'
import { BASE_TYPES } from '@/constants'
import { isArrayNode } from '@/lib/tree'
import { useRouteContext } from '@tanstack/react-router'
import TypeSelectorDialog from './type-selector-dialog'

interface TreeNodeControlsProps {
  node: TreeDataNode
  handleLabelChange: (id: string, label: string) => void
  handleDataTypeChange: (id: string, type: NodeDataType) => void
  handleFakerFunctionChange: (id: string, method: FakerFunction) => void
  handleItemDataTypeChange: (id: string, type: NodeDataType) => void
  handleCountChange: (id: string, count: number) => void
}

const TreeNodeControls: React.FC<TreeNodeControlsProps> = ({
  node,
  handleLabelChange,
  handleDataTypeChange,
  handleFakerFunctionChange,
  handleItemDataTypeChange,
  handleCountChange,
}) => {
  const fakerMethods = useRouteContext({
    from: '/',
    select: (state) => state.fakerMethods,
  })

  const handleTypeSelect = (value: string) => {
    if (BASE_TYPES.includes(value as BaseType)) {
      handleDataTypeChange(node.id, value as BaseType)
    } else {
      const category = fakerMethods.find((m) => m.items.some((item) => item.method === value))?.category
      if (category) {
        handleDataTypeChange(node.id, category)
        handleFakerFunctionChange(node.id, value)
      }
    }
  }

  const handleArrayItemTypeSelect = (value: string) => {
    if (BASE_TYPES.includes(value as BaseType)) {
      handleItemDataTypeChange(node.id, value as BaseType)
    } else {
      const category = fakerMethods.find((m) => m.items.some((item) => item.method === value))?.category
      if (category) {
        handleItemDataTypeChange(node.id, category)
        handleFakerFunctionChange(node.id, value)
      }
    }
  }

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
        <Input value={node.label} onChange={(e) => handleLabelChange(node.id, e.target.value)} className='h-8 w-full' placeholder='Property Name' />

        <TypeSelectorDialog
          onSelect={handleTypeSelect}
          selectedValue={node.fakerFunction ?? node.dataType}
          baseTypes={BASE_TYPES}
          fakerMethods={fakerMethods}
        />

        {isArrayNode(node) && (
          <>
            <Input
              type='number'
              min={1}
              max={100}
              value={node.count}
              onChange={(e) => handleCountChange(node.id, parseInt(e.target.value) || 1)}
              className='h-8 w-full sm:w-[100px]'
              placeholder='Count'
            />
            <TypeSelectorDialog
              onSelect={handleArrayItemTypeSelect}
              selectedValue={node.fakerFunction ?? node.itemDataType}
              baseTypes={BASE_TYPES.filter((type): type is BaseType => type !== 'array')}
              fakerMethods={fakerMethods}
            />
          </>
        )}
      </div>
    </div>
  )
}

TreeNodeControls.displayName = 'TreeNodeControls'

export default TreeNodeControls
