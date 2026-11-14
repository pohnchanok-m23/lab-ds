# @lab-ds/ui

A React + Tailwind CSS v4 design system built on [shadcn/ui](https://ui.shadcn.com).

## Install

```bash
pnpm add @lab-ds/ui
```

Peer dependencies: `react`, `react-dom` (18 or 19) and `tailwindcss` v4.

## Setup

In your global stylesheet (for example `app/globals.css` in Next.js), import the tokens after Tailwind:

```css
@import "tailwindcss";
@import "@lab-ds/ui/styles.css";
```

The stylesheet tells Tailwind to scan the package, so you don't need an extra `@source` line.

## Usage

```tsx
import { Button } from "@lab-ds/ui";

export default function Page() {
  return <Button variant="outline">Click me</Button>;
}
```

Components work in Next.js Server Components: the bundle is marked `"use client"`.

Dark mode: add the `dark` class to a parent element (for example `<html class="dark">`).
