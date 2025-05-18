// components/custom/type-selector-command.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Search, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FakerMethodCategory } from '@/types/tree'

interface TypeSelectorCommandProps {
  onSelect: (value: string) => void
  baseTypes?: readonly string[]
  fakerMethods: FakerMethodCategory[]
  position: { top: number; left: number }
  onClose: () => void
}

const TypeSelectorCommand: React.FC<TypeSelectorCommandProps> = ({ onSelect, fakerMethods, position, onClose }) => {
  const [search, setSearch] = useState('')
  const commandRef = useRef<HTMLDivElement>(null)

  const filteredMethods = useMemo(() => {
    if (!search) return fakerMethods

    const searchLower = search.toLowerCase().trim()
    const searchParts = searchLower.split('.')

    return fakerMethods
      .map((category) => ({
        ...category,
        items: category.items.filter((method) => {
          const methodParts = method.method.toLowerCase().split('.')

          if (searchParts.length === 1) {
            return (
              method.method.toLowerCase().includes(searchLower) ||
              method.description.toLowerCase().includes(searchLower) ||
              category.category.toLowerCase().includes(searchLower)
            )
          } else {
            return methodParts[0].startsWith(searchParts[0]) && methodParts[1]?.startsWith(searchParts[1] || '')
          }
        }),
      }))
      .filter((category) => category.items.length > 0)
  }, [fakerMethods, search])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const formatCode = (code: string) => {
    return code.replace(/\n\s+/g, '\n').trim()
  }

  const handleCommandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      ref={commandRef}
      className='fixed z-50'
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(10px)',
      }}
      role='button'
      onClick={handleCommandClick}
    >
      <Command className='rounded-lg border shadow-md bg-popover w-[500px]'>
        {' '}
        {/* Increased width */}
        <div className='p-2 border-b'>
          <CommandInput
            placeholder='Search faker methods...'
            value={search}
            onValueChange={setSearch}
            className='border-none focus:ring-0'
            onClick={(e) => e.stopPropagation()}
            autoFocus={true}
          />
        </div>
        <CommandList>
          <CommandEmpty className='flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground'>
            <Search className='w-4 h-4' />
            No results found.
          </CommandEmpty>

          {filteredMethods.map((category) => (
            <CommandGroup
              key={category.category}
              heading={
                <div className='flex flex-col gap-1 px-2 py-1.5'>
                  <span className='font-semibold capitalize'>{category.category}</span>
                  <span className='text-xs text-muted-foreground break-words whitespace-pre-wrap'>{category.description}</span>
                </div>
              }
              className='pb-2'
            >
              {category.items.map((method) => (
                <CommandItem
                  key={method.method}
                  onSelect={() => {
                    onSelect(method.method)
                    onClose()
                  }}
                  className={cn(
                    'flex flex-col items-start gap-1.5 px-4 py-3 cursor-pointer',
                    'data-[selected=true]:bg-accent/50 hover:bg-accent/50',
                    'transition-colors duration-100',
                  )}
                >
                  {/* Method Header */}
                  <div className='flex items-center gap-2 w-full'>
                    <Wand2 className='w-4 h-4 text-muted-foreground/70' />
                    <span className='font-medium'>{method.method}</span>
                  </div>

                  {/* Description and Details */}
                  <div className='pl-6 space-y-2 w-full max-w-full'>
                    {/* Description */}
                    <p className='text-sm text-muted-foreground leading-snug break-words whitespace-pre-wrap max-w-full'>{method.description}</p>
                    {/* Parameters & Example */}
                    <div className='space-y-2 max-w-full'>
                      {method.parameters && (
                        <div className='space-y-1 max-w-full'>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-xs font-medium text-muted-foreground/70'>Parameters</span>
                          </div>
                          <div className='relative w-full'>
                            <pre className='text-xs bg-muted/50 p-2 rounded-md overflow-x-auto whitespace-pre-wrap break-words max-w-full'>
                              <code className='text-xs'>{formatCode(method.parameters)}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                      {method.example && (
                        <div className='space-y-1 max-w-full'>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-xs font-medium text-muted-foreground/70'>Example</span>
                          </div>
                          <div className='relative w-full'>
                            <pre className='text-xs bg-muted/50 p-2 rounded-md overflow-x-auto whitespace-pre-wrap break-all'>
                              <code className='text-xs'>{formatCode(method.example)}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
              <CommandSeparator />
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  )
}

export default TypeSelectorCommand
