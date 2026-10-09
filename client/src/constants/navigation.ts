import { Braces, Database, FileSpreadsheet, BookOpen, FileText, Radio } from 'lucide-react'
export const NAVIGATION_ITEMS = [
  { to: '/', label: 'JSON generator', icon: Braces, group: 'Generate' },
  { to: '/csv', label: 'CSV export', icon: FileSpreadsheet, group: 'Generate' },
  { to: '/sql', label: 'SQL statements', icon: Database, group: 'Generate' },
  { to: '/template', label: 'Text templates', icon: FileText, group: 'Tools' },
  { to: '/mock', label: 'Mock API', icon: Radio, group: 'Tools' },
  { to: '/helper', label: 'Faker reference', icon: BookOpen, group: 'Tools' },
] as const
export const NAVIGATION_GROUPS = ['Generate', 'Tools'] as const
