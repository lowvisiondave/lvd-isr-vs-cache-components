# Turborepo Monorepo

This is a [Turborepo](https://turbo.build/repo) monorepo containing a Next.js application and a shared UI component library.

## What's inside?

This monorepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org) app (App Router)
- `@repo/ui`: a shared React component library with Tailwind CSS

Each package and app is written in [TypeScript](https://www.typescriptlang.org/).

### Utilities

This monorepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Build

To build all apps and packages:

```bash
pnpm build
```

### Develop

To develop all apps and packages:

```bash
pnpm dev
```

### Run Linting

To lint all apps and packages:

```bash
pnpm lint
```

## Using the UI Package

The `@repo/ui` package contains shared React components that can be used across all apps in the monorepo.

Example usage in the Next.js app:

```tsx
import { Button } from "@repo/ui";

export default function Page() {
  return <Button>Click me</Button>;
}
```

## Tailwind CSS

Tailwind CSS is configured in both the Next.js app and the UI package. The Next.js app's Tailwind config includes paths to the UI package components, ensuring that Tailwind classes used in the UI package are properly processed.
