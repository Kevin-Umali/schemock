// src/components/custom/tree-node-controls.tsx

import { Input } from '@/components/ui/input'
import { TreeDataNode, NodeDataType, FakerFunction, BaseType } from '@/types/tree'
import { BASE_TYPES } from '@/constants'
import { isArrayNode } from '@/lib/tree'
import { useRouteContext } from '@tanstack/react-router'
import TypeSelectorDialog from './type-selector-dialog'
import { motion, AnimatePresence } from 'framer-motion'

interface TreeNodeControlsProps {
  node: TreeDataNode
  handleLabelChange: (id: string, label: string) => void
  handleDataTypeChange: (id: string, type: NodeDataType) => void
  handleFakerFunctionChange: (id: string, method: FakerFunction, type: NodeDataType) => void
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
        handleFakerFunctionChange(node.id, value, category)
      }
    }
  }

  const handleArrayItemTypeSelect = (value: string) => {
    if (BASE_TYPES.includes(value as BaseType)) {
      handleItemDataTypeChange(node.id, value as BaseType)
    } else {
      const category = fakerMethods.find((m) => m.items.some((item) => item.method === value))?.category
      if (category) {
        handleFakerFunctionChange(node.id, value, category)
      }
    }
  }

  const controlsVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  }

  const arrayControlsVariants = {
    hidden: { opacity: 0, x: -10, width: 0 },
    visible: {
      opacity: 1,
      x: 0,
      width: 'auto',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      x: -10,
      width: 0,
      transition: {
        duration: 0.15,
      },
    },
  }

  return (
    <motion.div className='flex flex-col gap-2 w-full' initial='hidden' animate='visible' variants={controlsVariants}>
      <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
        <motion.div className='w-full' whileTap={{ scale: 0.98 }}>
          <Input value={node.label} onChange={(e) => handleLabelChange(node.id, e.target.value)} className='h-8 w-full' placeholder='Property Name' />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <TypeSelectorDialog onSelect={handleTypeSelect} selectedValue={node.dataType} baseTypes={BASE_TYPES} fakerMethods={fakerMethods} />
        </motion.div>

        <AnimatePresence mode='wait'>
          {isArrayNode(node) && (
            <motion.div
              className='flex flex-col sm:flex-row items-center gap-2'
              variants={arrayControlsVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <motion.div className='w-full sm:w-[100px]' whileTap={{ scale: 0.98 }}>
                <Input
                  type='number'
                  min={1}
                  max={100}
                  value={node.count}
                  onChange={(e) => handleCountChange(node.id, parseInt(e.target.value) || 1)}
                  className='h-8 w-full'
                  placeholder='Count'
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TypeSelectorDialog
                  onSelect={handleArrayItemTypeSelect}
                  selectedValue={node.fakerFunction ?? node.itemDataType}
                  baseTypes={BASE_TYPES.filter((type): type is BaseType => type !== 'array')}
                  fakerMethods={fakerMethods}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

TreeNodeControls.displayName = 'TreeNodeControls'

export default TreeNodeControls
