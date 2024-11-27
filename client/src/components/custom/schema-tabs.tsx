// src/components/SchemaTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

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
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  const triggerVariants = {
    inactive: {
      scale: 1,
    },
    active: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  const contentVariants = {
    enter: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
    center: {
      zIndex: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
      <TabsList className='mb-4'>
        {tabs.map((tab) => (
          <motion.div key={tab.value} initial='inactive' animate='inactive' whileHover='hover' whileTap='tap' variants={triggerVariants}>
            <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
          </motion.div>
        ))}
      </TabsList>

      <AnimatePresence mode='sync'>
        <motion.div key={activeTab} initial='enter' animate='center' exit='exit' variants={contentVariants}>
          <TabsContent value={activeTab}>{tabs.find((tab) => tab.value === activeTab)?.content}</TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}

SchemaTabs.displayName = 'SchemaTabs'

export default SchemaTabs
