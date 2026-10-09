import { UsageDocs } from '@/features/docs/components/usage-docs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs')({ component: UsageDocs })
