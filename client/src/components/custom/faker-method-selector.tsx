// src/components/custom/faker-method-selector.tsx

import React, { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BASE_TYPES } from '@/constants'

interface FakerMethodSelectorProps {
  value: string
  onSelect: (method: string, example: string) => void
  onOpenChange?: (open: boolean) => void
  isOpen?: boolean
  fakerMethods?: any[]
}

const FakerMethodSelector: React.FC<FakerMethodSelectorProps> = ({ value, onSelect, onOpenChange, isOpen, fakerMethods = [] }) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('categories')

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)
      if (onOpenChange) {
        onOpenChange(newOpen)
      }
    },
    [onOpenChange],
  )

  const filteredMethods = useMemo(() => {
    if (!searchTerm) return fakerMethods

    return fakerMethods.filter(
      (category) =>
        category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.items.some(
          (item: any) => item.method.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
  }, [fakerMethods, searchTerm])

  const handleSelect = useCallback(
    (method: string, example: string = '') => {
      onSelect(method, example)
      handleOpenChange(false)
    },
    [onSelect, handleOpenChange],
  )

  const displayValue = useMemo(() => {
    if (!value) return 'Select method'

    // Check if it's a base type
    if (BASE_TYPES.includes(value as 'object' | 'array')) {
      return value
    }

    // Otherwise, it's a faker method
    return value
  }, [value])

  return (
    <Dialog open={isOpen !== undefined ? isOpen : open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full justify-start text-left font-normal'>
          {displayValue}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl max-h-[80vh]'>
        <DialogHeader>
          <DialogTitle>Select Faker Method</DialogTitle>
        </DialogHeader>

        <div className='relative mb-4'>
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <Input placeholder='Search methods...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-8' />
        </div>

        <Tabs defaultValue='categories' value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='mb-4'>
            <TabsTrigger value='categories'>Categories</TabsTrigger>
            <TabsTrigger value='all'>All Methods</TabsTrigger>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value='categories' className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
              <div className='space-y-2'>
                <h3 className='font-medium'>Base Types</h3>
                {BASE_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant='outline'
                    className={cn('w-full justify-start text-left font-normal', value === type && 'bg-primary/10')}
                    onClick={() => handleSelect(type)}
                  >
                    {type}
                    {value === type && <Check className='ml-auto h-4 w-4' />}
                  </Button>
                ))}
              </div>

              {filteredMethods.map((category) => (
                <div key={category.category} className='space-y-2'>
                  <h3 className='font-medium capitalize'>{category.category}</h3>
                  <Button
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                    onClick={() => {
                      setSelectedCategory(category.category)
                      setActiveTab('all')
                    }}
                  >
                    Browse {category.category} methods
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='all'>
            <ScrollArea className='h-[400px]'>
              <div className='space-y-4 p-1'>
                {filteredMethods.map((category) => (
                  <div key={category.category} className={cn('space-y-2', selectedCategory && selectedCategory !== category.category && 'hidden')}>
                    <h3 className='font-medium capitalize'>{category.category}</h3>
                    <div className='grid grid-cols-1 gap-2'>
                      {category.items.map((method: any) => (
                        <Button
                          key={method.method}
                          variant='outline'
                          className={cn('w-full justify-start text-left font-normal h-auto', value === method.method && 'bg-primary/10')}
                          onClick={() => handleSelect(method.method, method.example)}
                        >
                          <div className='flex flex-col items-start'>
                            <div className='flex w-full justify-between'>
                              <span className='font-medium'>{method.method}</span>
                              {value === method.method && <Check className='ml-2 h-4 w-4' />}
                            </div>
                            <span className='text-xs text-muted-foreground'>{method.description}</span>
                            {method.example && (
                              <span className='text-xs text-muted-foreground mt-1'>
                                Example: <code className='bg-muted px-1 py-0.5 rounded'>{method.example}</code>
                              </span>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value='preview'>
            <div className='p-4 border rounded-md'>
              <h3 className='font-medium mb-2'>Selected Method</h3>
              <p className='text-sm'>{value || 'No method selected'}</p>

              {value && (
                <div className='mt-4'>
                  <h4 className='text-sm font-medium mb-1'>Example Usage</h4>
                  <pre className='bg-muted p-2 rounded text-xs overflow-x-auto'>
                    {`{
  "schema": {
    "field": "${value}"
  },
  "count": 1
}`}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FakerMethodSelector
