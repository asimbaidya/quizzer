import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/signup')({
  component: () => <div>Hello /signup!</div>,
})