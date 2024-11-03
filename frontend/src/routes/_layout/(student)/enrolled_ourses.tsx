import { createFileRoute, Outlet } from '@tanstack/react-router'

// Layout Route
export const Route = createFileRoute('/_layout/(student)/enrolled_ourses')({
  component: () => <Outlet />,
})
