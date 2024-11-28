import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/csv')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /csv!'
}
