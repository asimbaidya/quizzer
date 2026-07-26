# Quizzer — Frontend

React + TypeScript + shadcn/ui + TanStack Router/Query, built with `bun`. See the
[root README](../README.md) for the full overview.

```bash
cp .env.example .env      # VITE_API_URL -> backend
bun install
bun run dev               # http://localhost:5173

bunx biome check          # lint/format
bunx tsc --noEmit -p tsconfig.build.json   # typecheck
bun run build             # production build
bun run generate-client   # regenerate typed API client from ./openapi.json
```

Layout: `src/routes` (file-based routes), `src/components` (Student, Teacher,
Admin, Sidebar, `ui` = shadcn), `src/client` (generated API client),
`src/lib` (helpers & view types).
