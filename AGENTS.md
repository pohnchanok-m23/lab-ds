# AGENTS.md

Lab-ds is a public React + TypeScript design system built on shadcn/ui. It is published to npm as a compiled package (`@lab-ds/ui`, a placeholder name) and used in Next.js (App Router) apps.

## Stack

- pnpm workspaces (pnpm version pinned by `packageManager`) + Turborepo
- React 19, TypeScript 6.0 (strict). TS is pinned to `6.0.3` because typescript-eslint supports only `<6.1`. Do not upgrade to TS 7 until it does.
- Tailwind CSS v4 (CSS-first, no `tailwind.config.js`), Radix primitives, `class-variance-authority`, `cn()` (clsx + tailwind-merge)
- tsup builds the library (ESM + `.d.ts`)
- Vitest + React Testing Library (jsdom, globals enabled)
- ESLint flat config at the root (`eslint.config.mjs`)
- Changesets handles versioning and npm publishing

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
pnpm --filter @lab-ds/ui exec vitest run src/components/button.test.tsx
pnpm --filter @lab-ds/ui exec vitest run -t "asChild"
pnpm changeset                             # record a change for the next release
pnpm version-packages && pnpm release      # bump versions/changelogs, then build + publish
```

## Layout

```
packages/ui/                # published package @lab-ds/ui
  src/index.ts              # public API barrel, the only entry point
  src/components/*.tsx      # one file per component, test next to it (*.test.tsx)
  src/lib/utils.ts          # cn()
  src/styles/globals.css    # tokens, copied as-is to dist/styles.css
  components.json           # shadcn CLI config for this package
apps/docs/                  # Next.js 16 App Router docs/playground (private, ignored by changesets)
```

`apps/docs` uses `@lab-ds/ui` through `workspace:*` and resolves it via `exports`, which point at `dist/`. Library changes show up in docs only after a build, or while `pnpm dev` is running.

## Architecture rules that are easy to get wrong

- **The public API is `src/index.ts`.** Removing or renaming an export is a breaking change and needs a `major` changeset.
- **`"use client"` comes from a tsup banner.** It sits on top of the whole bundle so components can be imported from Server Components. Do not turn on tsup's `treeshake` option: it runs Rollup, which silently strips the banner. After changing the build config, check that `head -1 packages/ui/dist/index.js` still prints the directive.
- **No `@/` aliases and no `next/*` imports inside `packages/ui/src`.** ESLint enforces both rules. The shadcn CLI generates `@/` imports anyway (see `components.json`), so rewrite them as relative paths. React, React DOM and Tailwind are `peerDependencies`.
- **The stylesheet is a token layer, not a full Tailwind build.** `globals.css` must not `@import "tailwindcss"` (consumers import Tailwind themselves, before `@lab-ds/ui/styles.css`). It contains `@source "./"`, so the consumer's Tailwind scans the compiled `dist/*.js` for class names. That path is relative to `dist/styles.css`, so keep the CSS file at the dist root. The CSS is copied, not compiled (`build:css`), and is protected from tree-shaking by `"sideEffects": ["**/*.css"]`.
- **Theming:** semantic CSS variables in `:root` / `.dark`, mapped to utilities through `@theme inline`. Components use only semantic utilities (`bg-primary`, `text-muted-foreground`). To add a token, add the variable to both `:root` and `.dark`, plus a `--color-*` mapping.
- **Component conventions (shadcn v4 style):** a plain function taking `React.ComponentProps<"el">` (with React 19 `ref` passed as a prop, no `forwardRef`), `cva` variants with both the component and `xxxVariants` exported, an exported `XxxProps` type, `asChild` through Radix `Slot`, a `data-slot="xxx"` attribute on the root, and `className` merged last with `cn()`.
- **New dependencies with install scripts** must be added to `onlyBuiltDependencies` in `pnpm-workspace.yaml` (esbuild is already there). Otherwise pnpm skips their scripts without failing.

## Adding a component

1. Run `pnpm dlx shadcn@latest add <name>` from `packages/ui`.
2. Rewrite the `@/` imports as relative paths and replace hard-coded colors with tokens. If the component needs an animation library such as `tw-animate-css`, add it as a dependency and import it in `globals.css`. Then confirm the import resolves from a consumer app (build docs).
3. Export the component and its types from `src/index.ts`.
4. Add `<name>.test.tsx` next to it and a demo in `apps/docs`.
5. Run `pnpm changeset`.
