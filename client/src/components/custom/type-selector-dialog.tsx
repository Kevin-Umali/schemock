// src/components/custom/type-selector-dialog.tsx

import React, { useState, useMemo } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FakerMethodCategory } from '@/types/tree'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const baseTypeDescriptions: { [key: string]: string } = {
  array: 'List of repeating items',
  object: 'Nested structure with properties',
}

const baseTypeDetailedDescriptions: { [key: string]: string } = {
  array: 'Create a list of repeating items. You can specify the number of items and their type (e.g., array of objects, strings, numbers).',
  object: 'Create a nested structure with custom properties. Add multiple fields to build complex data structures or JSON schemas.',
}

interface TypeSelectorDialogProps {
  onSelect: (value: string) => void
  selectedValue?: string
  baseTypes: readonly string[]
  fakerMethods: FakerMethodCategory[]
}

const TypeSelectorDialog: React.FC<TypeSelectorDialogProps> = ({ onSelect, selectedValue, baseTypes, fakerMethods }) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredMethods = useMemo(() => {
    if (!searchTerm) return fakerMethods

    return fakerMethods.filter(
      (category) =>
        category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.items.some(
          (item) => item.method.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
  }, [fakerMethods, searchTerm])

  const handleSelect = (value: string) => {
    onSelect(value)
    setOpen(false)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  }

  const methodVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
  }

  const renderMethodContent = () => {
    if (!selectedCategory) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center text-muted-foreground py-8'>
          Select a category from the left to view available options
        </motion.div>
      )
    }

    if (baseTypes.includes(selectedCategory)) {
      return (
        <motion.div variants={methodVariants} initial='hidden' animate='visible'>
          <Button
            variant='ghost'
            className={cn('w-full flex flex-col items-start p-3 h-auto hover:bg-muted relative', selectedValue === selectedCategory && 'bg-muted font-medium')}
            onClick={() => handleSelect(selectedCategory)}
          >
            <div className='flex justify-between w-full'>
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              <AnimatePresence>
                {selectedValue === selectedCategory && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className='ml-2 h-4 w-4' />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {(selectedCategory.toLowerCase() === 'array' || selectedCategory.toLowerCase() === 'object') && (
              <span className='text-sm text-muted-foreground whitespace-normal text-left'>{baseTypeDetailedDescriptions[selectedCategory.toLowerCase()]}</span>
            )}
          </Button>
        </motion.div>
      )
    }

    const categoryMethods = fakerMethods.find((cat) => cat.category === selectedCategory)?.items
    if (!categoryMethods) return null

    return (
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='grid gap-2'>
        {categoryMethods.map((method) => (
          <motion.div key={method.method} variants={itemVariants}>
            <Button
              key={method.method}
              variant='ghost'
              className={cn('w-full flex flex-col items-start p-3 h-auto hover:bg-muted relative', selectedValue === method.method && 'bg-muted font-medium')}
              onClick={() => handleSelect(method.method)}
            >
              <div className='flex justify-between w-full'>
                <span className='font-medium'>{method.method.split('.')[1]}</span>
                <AnimatePresence>
                  {selectedValue === method.method && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className='ml-2 h-4 w-4' />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className='text-sm text-muted-foreground whitespace-normal text-left'>{method.description}</span>
              {method.parameters && (
                <span className='text-xs text-muted-foreground whitespace-normal text-left mt-1'>
                  Parameters: <code className='bg-muted px-1 py-0.5 rounded'>{method.parameters}</code>
                </span>
              )}
              {method.example && (
                <span className='text-xs text-muted-foreground whitespace-normal text-left mt-1'>
                  Example: <code className='bg-muted px-1 py-0.5 rounded'>{method.example}</code>
                </span>
              )}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='h-8 w-full sm:w-[180px]'>
          {selectedValue ? selectedValue.split('.').pop() : 'Select Type'}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-5xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='flex flex-col md:flex-row h-[650px] md:h-[600px] gap-4'
        >
          {/* Left Panel - Categories */}
          <motion.div variants={containerVariants} initial='hidden' animate='visible' className='w-full md:w-1/3 flex flex-col h-1/2 md:h-full'>
            <div className='mb-4'>
              <DialogTitle className='text-lg font-semibold'>Categories</DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>Select a category to view options</DialogDescription>
            </div>
            <ScrollArea className='flex-1 border rounded-md overflow-auto'>
              <div className='p-2'>
                <div className='font-semibold mb-2'>Base Types</div>
                {baseTypes.map((type) => (
                  <div key={type} className='mb-3'>
                    <Button
                      variant='ghost'
                      className={cn('w-full justify-start mb-1 flex flex-col items-start h-auto', selectedCategory === type && 'bg-muted')}
                      onClick={() => setSelectedCategory(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                      {(type.toLowerCase() === 'array' || type.toLowerCase() === 'object') && (
                        <span className='text-xs text-muted-foreground whitespace-normal text-left'>{baseTypeDescriptions[type.toLowerCase()]}</span>
                      )}
                    </Button>
                  </div>
                ))}

                <div className='font-semibold mb-2 mt-4'>Faker Categories</div>
                {filteredMethods.map((category) => (
                  <Button
                    key={category.category}
                    variant='ghost'
                    className={cn('w-full justify-start mb-1 flex flex-col items-start h-auto', selectedCategory === category.category && 'bg-muted')}
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    <span>{category.category.charAt(0).toUpperCase() + category.category.slice(1)}</span>
                    <span className='text-xs text-muted-foreground whitespace-normal text-left'>{category.description}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Right Panel - Methods */}
          <motion.div variants={containerVariants} initial='hidden' animate='visible' className='w-full md:w-2/3 flex flex-col h-1/2 md:h-full'>
            <div className='mb-4'>
              <DialogTitle className='text-lg font-semibold'>Available Methods</DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground mb-2'>Search and select methods to generate data</DialogDescription>
              <Input placeholder='Search methods...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='h-8' />
            </div>
            <ScrollArea className='flex-1 border rounded-md overflow-auto'>
              <div className='p-4'>{renderMethodContent()}</div>
            </ScrollArea>
          </motion.div>
        </motion.div>
        <DialogFooter>
          <Button className='w-full md:w-52 mt-2' variant='outline' onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

TypeSelectorDialog.displayName = 'TypeSelectorDialog'

export default TypeSelectorDialog
