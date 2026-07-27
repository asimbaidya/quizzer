import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { render } from "@testing-library/react"

import { routeTree } from "@/routeTree.gen"

/** A QueryClient tuned for tests: no retries, no background chatter. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface RenderRouteOptions {
  /** Path to start the memory history at, e.g. "/quiz/math/q1". */
  initialPath: string
  /** Seed an auth token so `_layout` guards let the route render. */
  token?: string | null
  queryClient?: QueryClient
}

/**
 * Render the real application route tree at `initialPath` using an in-memory
 * history. This exercises route params, `beforeLoad` guards, and data loading
 * exactly as they run in the app — the faithful way to integration-test a route.
 */
export function renderRoute({
  initialPath,
  token = "test-token",
  queryClient = createTestQueryClient(),
}: RenderRouteOptions) {
  if (token === null) localStorage.removeItem("access_token")
  else localStorage.setItem("access_token", token)

  const history = createMemoryHistory({ initialEntries: [initialPath] })
  const router = createRouter({
    routeTree,
    history,
    context: { queryClient },
  })

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { router, queryClient, ...utils }
}
