import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, vi } from "vitest"

import { OpenAPI } from "@/client"
import { API } from "./mocks/handlers"
import { server } from "./mocks/server"

// Point the generated client at the origin MSW handlers are registered on.
// main.tsx (which normally sets this from VITE_API_URL) does not run in tests.
OpenAPI.BASE = API

// ---- MSW lifecycle ----------------------------------------------------------
// Fail loudly on any request that has no handler so tests can't silently pass
// against the real network.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => {
  server.resetHandlers()
  cleanup()
  localStorage.clear()
})
afterAll(() => server.close())

// ---- jsdom polyfills that Radix / hooks rely on -----------------------------
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated but some libs still call it
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  })
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ||= ResizeObserverStub as never

// jsdom's scrollTo throws "Not implemented"; TanStack Router calls it on nav.
window.scrollTo = vi.fn() as never

// Radix uses these in jsdom where they are not implemented.
Element.prototype.scrollIntoView ||= vi.fn()
Element.prototype.hasPointerCapture ||= vi.fn(() => false) as never
Element.prototype.setPointerCapture ||= vi.fn() as never
Element.prototype.releasePointerCapture ||= vi.fn() as never
