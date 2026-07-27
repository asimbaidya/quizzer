import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/teach/$courseTitle")({
  component: () => <Outlet />,
})
