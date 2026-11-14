# Lab-ds

Monorepo for `@lab-ds/ui`, a React + Tailwind CSS v4 design system built on shadcn/ui.

- [`packages/ui`](packages/ui): the published npm package (see its README for consumer setup)
- [`apps/docs`](apps/docs): Next.js docs and playground

## Development

```bash
pnpm install
pnpm dev
```

The docs app runs at http://localhost:3000.

## Releasing

1. `pnpm changeset` to describe the change.
2. `pnpm version-packages` to bump versions and update changelogs.
3. `pnpm release` to build and publish to npm.
