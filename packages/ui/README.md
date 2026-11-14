# @lab-ds/ui

A React + Tailwind CSS v4 design system built on [shadcn/ui](https://ui.shadcn.com) (`base-nova` style, [Base UI](https://base-ui.com) primitives).

## Install

```bash
pnpm add @lab-ds/ui
```

Peer dependencies: `react` and `react-dom` (18 or 19), plus `tailwindcss` v4.

## Setup

In your global stylesheet (for example `app/globals.css` in Next.js), import the stylesheet after Tailwind:

```css
@import "tailwindcss";
@import "@lab-ds/ui/styles.css";
```

`styles.css` contains the design tokens (light and `.dark`), base styles and the component styles. It also tells Tailwind to scan the package, so you don't need an extra `@source` line.

Fonts: components use `--font-sans` (Dialog titles use it through `font-heading`). Set it in your app, for example with `next/font` and `variable: "--font-sans"`.

Dark mode: put the `dark` class on a parent element, for example `<html class="dark">` or `next-themes` with `attribute="class"`.

## Usage

```tsx
import {
  Button,
  buttonVariants,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@lab-ds/ui";

<Button variant="outline" size="sm">Save</Button>

// Style another element as a button:
<a href="/docs" className={buttonVariants({ variant: "ghost" })}>Docs</a>

// Compose with the Base UI `render` prop (not `asChild`):
<Dialog>
  <DialogTrigger render={<Button />}>Open</DialogTrigger>
  <DialogContent>
    <DialogTitle>Hello</DialogTitle>
  </DialogContent>
</Dialog>
```

Every component works in React Server Components, and `buttonVariants()` can be called on the server.
