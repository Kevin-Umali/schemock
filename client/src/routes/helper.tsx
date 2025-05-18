import { useCallback, useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Copy, Check } from 'lucide-react'
import Spinner from '@/components/custom/spinner'
import { cn } from '@/lib/utils'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { useGetFakerFunctions } from '@/api/queries'
// Define the types we need for this component
interface FakerMethodItem {
  method: string
  description: string
  parameters: string
  example: string
}

interface FakerMethodCategory {
  category: string
  description: string
  items: FakerMethodItem[]
}

export const Route = createFileRoute('/helper')({
  component: Helper,
  pendingComponent: () => (
    <div className='flex items-center justify-center'>
      <Spinner show text='Loading...' />
    </div>
  ),
  pendingMinMs: 3000,
  pendingMs: 10,
})

function Helper() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [copiedText, copy] = useCopyToClipboard()

  const { data: fakerMethods, isLoading } = useGetFakerFunctions()

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setSelectedCategory(null)
  }, [])

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category)
  }, [])

  const handleCopyMethod = useCallback(
    async (method: string) => {
      await copy(method)
    },
    [copy],
  )

  const filteredMethods = useMemo(() => {
    if (!fakerMethods) return [] as FakerMethodCategory[]

    if (!searchTerm && !selectedCategory) return fakerMethods

    if (selectedCategory) {
      return fakerMethods.filter((category: FakerMethodCategory) => category.category === selectedCategory)
    }

    return fakerMethods.filter(
      (category: FakerMethodCategory) =>
        category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.items.some(
          (item: FakerMethodItem) =>
            item.method.toLowerCase().includes(searchTerm.toLowerCase()) ?? item.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
  }, [fakerMethods, searchTerm, selectedCategory])

  const categories = useMemo(() => {
    if (!fakerMethods) return [] as string[]
    return fakerMethods.map((category: FakerMethodCategory) => category.category)
  }, [fakerMethods])

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      {isLoading ? (
        <div className='flex min-h-[50vh] items-center justify-center'>
          <Spinner show text='Loading faker methods' />
        </div>
      ) : (
        <>
          <div className='border rounded-lg p-4 mb-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Faker Methods Helper</h2>
            <div className='relative mb-4'>
              <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Search faker methods...'
                value={searchTerm}
                onChange={handleSearch}
                className='pl-8 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <Tabs defaultValue='categories' className='w-full'>
              <TabsList className='mb-4'>
                <TabsTrigger value='categories'>Categories</TabsTrigger>
                <TabsTrigger value='all'>All Methods</TabsTrigger>
                <TabsTrigger value='examples'>Usage Examples</TabsTrigger>
              </TabsList>

              <TabsContent value='categories' className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {categories.map((category: string) => (
                    <Card
                      key={category}
                      className={cn(
                        'cursor-pointer transition-all duration-200 hover:shadow-md',
                        selectedCategory === category && 'border-blue-500 bg-blue-50',
                      )}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <CardHeader className='p-4'>
                        <CardTitle className='text-base capitalize'>{category}</CardTitle>
                        <CardDescription className='text-xs'>
                          {fakerMethods?.find((c: FakerMethodCategory) => c.category === category)?.items.length ?? 0} methods
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value='all'>
                <ScrollArea className='h-[600px] rounded-md border p-4'>
                  {filteredMethods.map((category: FakerMethodCategory) => (
                    <div key={category.category} className='mb-8'>
                      <h3 className='text-lg font-semibold capitalize mb-2'>{category.category}</h3>
                      <p className='text-sm text-gray-600 mb-4'>{category.description}</p>
                      <div className='space-y-4'>
                        {category.items.map((method: FakerMethodItem) => (
                          <Card key={method.method} className='overflow-hidden'>
                            <CardHeader className='p-4 pb-2 flex flex-row justify-between items-start'>
                              <div>
                                <CardTitle className='text-base font-mono'>{method.method}</CardTitle>
                                <CardDescription className='text-sm'>{method.description}</CardDescription>
                              </div>
                              <Button variant='ghost' size='sm' onClick={() => handleCopyMethod(method.method)} className='relative h-8 w-8 p-0 rounded-full'>
                                {copiedText === method.method ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4 text-gray-500' />}
                              </Button>
                            </CardHeader>
                            <CardContent className='p-4 pt-0'>
                              {method.parameters && (
                                <div className='mt-2'>
                                  <h4 className='text-xs font-semibold text-gray-700 mb-1'>Parameters:</h4>
                                  <pre className='text-xs bg-gray-50 p-2 rounded overflow-x-auto'>{method.parameters}</pre>
                                </div>
                              )}
                              {method.example && (
                                <div className='mt-2'>
                                  <h4 className='text-xs font-semibold text-gray-700 mb-1'>Example:</h4>
                                  <pre className='text-xs bg-gray-50 p-2 rounded overflow-x-auto'>{method.example}</pre>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value='examples'>
                <ScrollArea className='h-[600px] rounded-md border p-4'>
                  <div className='space-y-8'>
                    {/* JSON Schema Example */}
                    <Card>
                      <CardHeader>
                        <CardTitle>JSON Schema Example</CardTitle>
                        <CardDescription>How to use faker methods in a JSON schema</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className='text-sm bg-gray-50 p-4 rounded overflow-x-auto'>
                          {`{
  "schema": {
    "user": {
      "name": "person.firstName",
      "email": "internet.email",
      "address": {
        "street": "location.streetAddress",
        "city": "location.city",
        "country": "location.country"
      }
    }
  },
  "count": 1,
  "locale": "en"
}`}
                        </pre>
                        <p className='mt-4 text-sm text-gray-600'>
                          This schema will generate a nested JSON object with user information including name, email, and address.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Template Example */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Template Example</CardTitle>
                        <CardDescription>How to use faker methods in a template</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className='text-sm bg-gray-50 p-4 rounded overflow-x-auto'>
                          {`Hello, my name is {{person.firstName}} {{person.lastName}} and I work as a {{person.jobTitle}}.
You can reach me at {{internet.email}} or {{phone.number}}.
I live in {{location.city}}, {{location.country}}.`}
                        </pre>
                        <p className='mt-4 text-sm text-gray-600'>
                          This template will generate a paragraph with random person information, including name, job, contact details, and location.
                        </p>
                      </CardContent>
                    </Card>

                    {/* SQL Example */}
                    <Card>
                      <CardHeader>
                        <CardTitle>SQL Schema Example</CardTitle>
                        <CardDescription>How to generate SQL insert statements</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className='text-sm bg-gray-50 p-4 rounded overflow-x-auto'>
                          {`{
  "schema": {
    "name": "person.firstName",
    "email": "internet.email",
    "age": "datatype.number",
    "active": "datatype.boolean"
  },
  "count": 5,
  "locale": "en",
  "tableName": "users",
  "multiRowInsert": true
}`}
                        </pre>
                        <p className='mt-4 text-sm text-gray-600'>
                          This schema will generate SQL insert statements for a users table with name, email, age, and active status fields.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Object in Template Example */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Object in Template Example</CardTitle>
                        <CardDescription>How to use object data in templates</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className='text-sm bg-gray-50 p-4 rounded overflow-x-auto'>
                          {`User Profile: {
  "name": "{{person.fullName}}",
  "email": "{{internet.email}}",
  "address": {
    "street": "{{location.streetAddress}}",
    "city": "{{location.city}}",
    "country": "{{location.country}}"
  },
  "payment": {
    "cardNumber": "{{finance.creditCardNumber}}",
    "issuer": "{{finance.creditCardIssuer}}"
  }
}

Address Information: {{location.streetAddress}}, {{location.city}}, {{location.country}}

Payment Methods: {{finance.creditCardNumber}} ({{finance.creditCardIssuer}})`}
                        </pre>
                        <p className='mt-4 text-sm text-gray-600'>
                          This template demonstrates how to include complex objects in templates. The objects will be automatically formatted into readable
                          text. Note that we're using a JSON structure directly in the template rather than the deprecated <code>datatype.json()</code> method.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {selectedCategory && (
            <div className='border rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold text-gray-900 capitalize'>{selectedCategory} Methods</h2>
                <Button variant='outline' size='sm' onClick={() => setSelectedCategory(null)}>
                  Show All Categories
                </Button>
              </div>
              <div className='space-y-4'>
                {filteredMethods
                  .find((category: FakerMethodCategory) => category.category === selectedCategory)
                  ?.items.map((method: FakerMethodItem) => (
                    <Card key={method.method} className='overflow-hidden'>
                      <CardHeader className='p-4 pb-2 flex flex-row justify-between items-start'>
                        <div>
                          <CardTitle className='text-base font-mono'>{method.method}</CardTitle>
                          <CardDescription className='text-sm'>{method.description}</CardDescription>
                        </div>
                        <Button variant='ghost' size='sm' onClick={() => handleCopyMethod(method.method)} className='relative h-8 w-8 p-0 rounded-full'>
                          {copiedText === method.method ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4 text-gray-500' />}
                        </Button>
                      </CardHeader>
                      <CardContent className='p-4 pt-0'>
                        {method.parameters && (
                          <div className='mt-2'>
                            <h4 className='text-xs font-semibold text-gray-700 mb-1'>Parameters:</h4>
                            <pre className='text-xs bg-gray-50 p-2 rounded overflow-x-auto'>{method.parameters}</pre>
                          </div>
                        )}
                        {method.example && (
                          <div className='mt-2'>
                            <h4 className='text-xs font-semibold text-gray-700 mb-1'>Example:</h4>
                            <pre className='text-xs bg-gray-50 p-2 rounded overflow-x-auto'>{method.example}</pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
