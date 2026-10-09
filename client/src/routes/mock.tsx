import { MockWorkspace } from '@/features/mock/components/mock-workspace'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/mock')({ component: MockWorkspace })
