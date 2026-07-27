// Test-only zod entry.
//
// rolldown-vite (Vite 8) activates zod's `@zod/source` export condition for the
// bare "zod" specifier, resolving it to raw `src/index.ts`, whose namespace is
// missing the `z` object the app imports (`import { z } from "zod"`). We can't
// fix that via `resolve.conditions`, and aliasing straight to the built
// `index.js` trips Vite's `export *` + `export { z }` interop. So we re-export
// zod's built entry by an explicit file path (which bypasses the exports map)
// and re-attach `z` ourselves. vitest.config.ts aliases "zod" to this file.
import * as builtZod from "../../node_modules/zod/index.js"

export * from "../../node_modules/zod/index.js"

// `builtZod.z` is the namespace object; fall back to the module itself.
export const z = (builtZod as { z?: unknown }).z ?? builtZod
export default z
