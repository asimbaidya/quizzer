import path from "node:path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vitest/config"

// Dedicated Vitest config. We intentionally do NOT load the TanStack Router or
// Tailwind Vite plugins here: route-tree codegen and CSS processing add cost and
// noise with no value in jsdom. We keep the React (SWC) plugin for JSX/TSX and
// mirror the "@" alias from vite.config.ts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // See tests/shims/zod.ts — dodges rolldown-vite's `@zod/source` resolution.
      zod: path.resolve(__dirname, "./tests/shims/zod.ts"),
    },
  },
  // The dep pre-bundler otherwise resolves zod via its `@zod/source` export
  // condition (raw TS, no `z` namespace). Excluding it lets Vitest resolve zod
  // the same way the app's normal Vite build does -> built entry with `z`.
  optimizeDeps: { exclude: ["zod"] },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    css: false,
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      // istanbul (not v8): tests run under Bun, which lacks Node's V8 inspector
      // coverage API. istanbul instruments the source instead, so it works here.
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/client/**", // generated
        "src/routeTree.gen.ts",
        "src/**/*.d.ts",
        "src/main.tsx",
        "src/components/ui/**", // vendored shadcn primitives
      ],
      thresholds: {
        // Enforce full coverage on the pure, high-risk logic modules.
        "src/lib/quiz.ts": { lines: 100, functions: 100, branches: 90 },
        "src/utils.ts": { lines: 100, functions: 100, branches: 90 },
      },
    },
  },
})
