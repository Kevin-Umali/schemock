import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchSelect } from '@/components/ui/search-select'
import { Field } from '@/components/ui/field'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { ALL_METHOD_CATEGORIES } from '../constants/config'
import { filterMethodCategories, getMethodCategoryOptions } from '../utils/filter-methods'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { useRouteContext } from '@tanstack/react-router'
import { ArrowUpRight, Check, Copy, Search } from 'lucide-react'
import type * as React from 'react'
import { useState } from 'react'
export const MethodReference: React.FC = () => {
  const { fakerMethods } = useRouteContext({ from: '__root__' })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL_METHOD_CATEGORIES)
  const [copied, copy] = useCopyToClipboard()
  const groups = filterMethodCategories(fakerMethods, search, category)
  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10'>
      <div className='flex items-start justify-between gap-6 max-[720px]:flex-col'>
        <div>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>Find the right kind of data.</h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-muted-foreground'>
            Browse the generators available in this version of Schemock. Copy a method into your schema or template.
          </p>
        </div>
        <a
          href='https://fakerjs.dev/api/'
          target='_blank'
          rel='noreferrer'
          className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
        >
          Faker documentation <ArrowUpRight size={14} />
        </a>
      </div>
      <div className='my-8 flex flex-wrap gap-3'>
        <Field className='relative min-w-48 flex-1'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            aria-label='Search generators'
            placeholder='Search by method or description…'
            className='pl-9'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Field>
        <SearchSelect
          label='Generator category'
          value={category}
          options={getMethodCategoryOptions(fakerMethods)}
          onChange={setCategory}
        />
      </div>
      <p className='mb-4 text-xs text-muted-foreground'>
        {groups.reduce((total, group) => total + group.items.length, 0)} matching methods
      </p>
      {groups.length ? (
        groups.map((group) => (
          <section
            key={group.category}
            className='mb-6 min-w-0 overflow-hidden rounded-xl border border-border bg-card'
          >
            <div className='flex min-h-14 items-center justify-between gap-3 border-b border-border px-4 py-3'>
              <h2 className='text-base font-semibold capitalize'>{group.category}</h2>
              <span className='text-xs tabular-nums text-muted-foreground'>{group.items.length} methods</span>
            </div>
            <div className='divide-y divide-border'>
              {group.items.map((item) => (
                <div key={item.method} className='flex items-start justify-between gap-4 px-4 py-5 sm:px-5'>
                  <div className='min-w-0'>
                    <code className='text-sm font-medium'>{item.method}</code>
                    <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>{item.description}</p>
                    <details className='mt-3 text-xs text-muted-foreground'>
                      <summary>Parameters and example</summary>
                      {item.parameters && (
                        <pre className='mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-4 font-mono text-xs leading-6'>
                          {item.parameters}
                        </pre>
                      )}
                      {item.example && (
                        <pre className='mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-4 font-mono text-xs leading-6'>
                          {item.example}
                        </pre>
                      )}
                      <a
                        className='mt-2 inline-flex items-center gap-1 text-primary hover:underline'
                        href={`https://fakerjs.dev/api/${group.category}.html#${item.method.split('.')[1].toLowerCase()}`}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Current Faker documentation
                        <ArrowUpRight size={12} />
                      </a>
                    </details>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label={`Copy ${item.method}`}
                    onClick={() => copy(item.method)}
                  >
                    {copied === item.method ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ))
      ) : (
        <Empty className='px-6 py-8'>
          <EmptyTitle>No matching methods</EmptyTitle>
          <EmptyDescription>Try another search or category.</EmptyDescription>
        </Empty>
      )}
    </div>
  )
}
