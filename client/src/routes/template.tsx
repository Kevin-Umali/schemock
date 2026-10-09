import { TemplateWorkspace } from '@/features/template/components/template-workspace'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/template')({ component: TemplateWorkspace })
