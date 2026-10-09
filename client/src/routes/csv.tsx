import { GeneratorWorkspace } from '@/features/generator/components/generator-workspace'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/csv')({
  component: () => <GeneratorWorkspace key='csv' format='csv' />,
})
