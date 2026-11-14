# AGENTS.md

Lab-ds is a public React + TypeScript design system built on shadcn/ui (`base-nova` style, Base UI primitives). It is published to npm as a compiled package (`@lab-ds/ui`, a placeholder name) and used in Next.js (App Router) apps. Its components and tokens were extracted from the `frame-ds` app (`~/Desktop/frame-ds`), which keeps its own pages, Card and ProductCard.

## Stack

- pnpm workspaces (pnpm version pinned by `packageManager`) + Turborepo
- React 19, TypeScript 6.0 (strict). TS is pinned to `6.0.3` because typescript-eslint supports only `<6.1`. Do not upgrade to TS 7 until it does.
- **Base UI (`@base-ui/react`), not Radix.** Compose with the `render` prop, not `asChild`: `<DialogTrigger render={<Button />}>`. Primitive prop types are `XPrimitive.Props`.
- `cn` comes from the `cn` npm package (it replaces clsx + tailwind-merge). Components import `"cn"` directly; `src/lib/utils.ts` re-exports it for the public API.
- Tailwind CSS v4 (CSS-first). Component styles live in **CSS Modules**, using `@apply` inside `@layer components`.
- tsup builds the library (ESM + `.d.ts`); `tw-animate-css` is needed only at build time.
- Vitest + React Testing Library (jsdom, globals enabled); ESLint flat config at the root
- Changesets handles versioning; publishing is planned for Week 4

## Commands

Run these from the repo root. If pnpm isn't installed globally, use `npx pnpm@10.34.9 <cmd>` instead.

```bash
pnpm install
pnpm dev                                   # ui in tsup watch mode + docs at http://localhost:3000
pnpm build                                 # turbo: builds ui first, then docs
pnpm lint
pnpm typecheck                             # builds ui first, because docs type-checks against dist
pnpm test
pnpm --filter @lab-ds/ui test
pnpm --filter @lab-ds/ui exec vitest run src/components/Button/Button.test.tsx
pnpm --filter @lab-ds/ui exec vitest run -t "closes through DialogClose"
pnpm --filter @lab-ds/ui pack --dry-run    # check the tarball contents
pnpm changeset                             # record a change for the next release
```

## Layout

```
packages/ui/
  src/index.ts                     # public API barrel, the only JS entry point
  src/components/<Name>/           # PascalCase folder per component
    <Name>.tsx                     #   markup, props, variant → class mapping
    <Name>.module.css              #   all styles
    <Name>.test.tsx, index.ts
  src/styles/globals.css           # tokens + base layer, shipped (first part of dist/styles.css)
  src/styles/reference.css         # BUILD-ONLY @reference target (tailwindcss + tw-animate-css + tokens)
  src/css-modules.d.ts             # types for *.module.css imports
  postcss.config.mjs               # Tailwind, applied to CSS Modules by tsup and Vitest
  scripts/build-css.mjs            # writes dist/styles.css = tokens + compiled modules
apps/docs/                         # Next.js 16 docs/playground (private, ignored by changesets)
```

`apps/docs` uses `@lab-ds/ui` through `workspace:*` and resolves it via `exports`, which point at `dist/`. Library changes show up in docs only after a build, or while `pnpm dev` is running.

## How the CSS pipeline works (read this before touching styles or tsup)

1. Each `*.module.css` starts with `@reference "../../styles/reference.css";` and `@layer theme, base, components, utilities;`.
2. tsup runs every imported CSS file through `postcss.config.mjs`, which uses Tailwind to expand `@apply`. Then `loader: { ".css": "local-css" }` makes esbuild scope the class names and keyframes per file (`Button_root`, `Dialog_enter`) and emit `dist/index.css`.
3. `scripts/build-css.mjs` prepends `src/styles/globals.css` and writes `dist/styles.css`, which is the only stylesheet shipped (`@lab-ds/ui/styles.css`). It then deletes `dist/index.css`.
4. Consumers `@import "tailwindcss"` and then `@import "@lab-ds/ui/styles.css"`. Their Tailwind processes the tokens (`@theme inline`, base layer) and emits the theme variables the compiled modules reference (`--spacing`, `--text-sm`, …). The `@source "./"` in `globals.css` also scans `dist/*.js`.

Consequences:
- `globals.css` must never `@import "tailwindcss"`: consumers would load it twice. Build-only imports go in `reference.css`.
- Only `*.module.css` files may be imported from TS. With `local-css`, any other CSS file would be scoped too.
- Inside CSS Modules, wrap global classes in `:global(...)` (`:global(.dark) .root`). Don't `@apply` `dark:`, `group-*` or `peer-*` variants: they produce class selectors that get hashed.
- Every component accepts `className`, merged last with `cn`. That works because consumer utilities (the `utilities` layer) beat the module styles (the `components` layer).
- To add a token, add the variable to both `:root` and `.dark` in `globals.css`, plus a `--color-*` / `--radius-*` mapping in `@theme inline`.

## Architecture rules that are easy to get wrong

- **The public API is `src/index.ts`.** Removing or renaming an export is a breaking change and needs a `major` changeset.
- **No bundle-wide `"use client"`.** Components must stay server-renderable: `buttonVariants()` is called from Server Components. Interactivity comes from `@base-ui/react`, which stays external and ships its own `'use client'` directives. Don't add hooks or context to library components without first setting up a separate client entry point (esbuild drops per-file directives when it bundles). Do not turn on tsup's `treeshake` option either: it runs Rollup.
- **No `@/` aliases and no `next/*` imports inside `packages/ui/src`.** ESLint enforces both rules. React, React DOM and Tailwind are `peerDependencies`; fonts, theme switching (`next-themes`) and pages belong to apps.
- **Keep shadcn's prop names and `data-slot` attributes.** Sibling components target the slots (for example `[data-slot="button-group"]`).
- **New dependencies with install scripts** must be added to `onlyBuiltDependencies` in `pnpm-workspace.yaml`.

## Adding a component

1. Run `pnpm dlx shadcn@latest add <name>` from `packages/ui` (style `base-nova`). It writes a flat file.
2. Convert the output to `src/components/<Name>/` with a CSS Module, following the pipeline rules above. Rewrite `@/` imports as relative paths.
3. Export the component from `src/index.ts`, add `<Name>.test.tsx` and a demo in `apps/docs`.
4. Run `pnpm build`, check the component in docs, then run `pnpm changeset`.
