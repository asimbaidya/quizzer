import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { UsersService } from "@/client"

export const Route = createFileRoute("/_layout/teach")({
  component: () => <Outlet />,
  beforeLoad: async () => {
    const user = await UsersService.readUserMe()
    if (user.role !== "teacher" && !user.is_superuser) {
      throw redirect({ to: "/" })
    }
  },
})
