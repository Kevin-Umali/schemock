import { GeneratorWorkspace } from '@/features/generator/components/generator-workspace'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/sql')({
  component: () => <GeneratorWorkspace key='sql' format='sql' />,
})
