// src/components/SchemaTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type GenericTab = string

interface Tab {
  value: GenericTab
  label: string
  content: React.ReactNode
}

interface SchemaTabsProps {
  tabs: Tab[]
  defaultTab?: GenericTab
  onTabChange?: (tab: GenericTab) => void
}

const SchemaTabs: React.FC<SchemaTabsProps> = ({ tabs, defaultTab, onTabChange }) => {
  const initialTab = defaultTab ?? (tabs.length > 0 ? tabs[0].value : '')

  return (
    <Tabs defaultValue={initialTab} onValueChange={onTabChange} className='w-full'>
      <TabsList className='mb-4'>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

SchemaTabs.displayName = 'SchemaTabs'

export default SchemaTabs
