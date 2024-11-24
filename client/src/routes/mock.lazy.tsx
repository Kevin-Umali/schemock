import { createLazyRoute } from '@tanstack/react-router'

export const Route = createLazyRoute('/mock')({
  component: Mock,
})

function Mock() {
  return <div>Hello World</div>
}
