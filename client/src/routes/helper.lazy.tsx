import { createLazyRoute } from '@tanstack/react-router'

export const Route = createLazyRoute('/helper')({
  component: Helper,
})

function Helper() {
  return <div>Hello World</div>
}
