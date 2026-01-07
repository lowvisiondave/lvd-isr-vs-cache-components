# ISR vs Cache Components Demo

A side-by-side comparison of Next.js **ISR (Incremental Static Regeneration)** vs **Cache Components** (`"use cache"` directive).

## What's Inside

This monorepo demonstrates two different caching strategies in Next.js:

| App | Port | Caching Strategy |
|-----|------|-----------------|
| `apps/cache-components` | 3000 | Uses `"use cache"` directive for granular component-level caching |
| `apps/isr` | 3001 | Uses ISR for page-level caching |

### Key Differences

**Cache Components (`"use cache"`):**
- Component-level caching granularity
- Cache individual async components independently
- Dynamic segments work without pre-rendering all paths
- No need for `generateStaticParams`

**ISR:**
- Page-level caching
- Entire page cached as one unit
- No granular component-level control
- Traditional Next.js approach

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run Both Apps

```bash
pnpm dev
```

Then visit:
- **Cache Components:** [http://localhost:3000](http://localhost:3000)
- **ISR:** [http://localhost:3001](http://localhost:3001)

### Run Individual Apps

```bash
# Cache Components only
pnpm --filter cache-components dev

# ISR only
pnpm --filter isr dev
```

## Project Structure

```
├── apps/
│   ├── cache-components/    # Next.js app using "use cache"
│   └── isr/                 # Next.js app using ISR
├── packages/
│   └── ui/                  # Shared UI components
└── package.json
```

## How to Test

1. Navigate to any page (e.g., `/page-1`)
2. Note the "Created at" timestamp - this shows when the page/component was cached
3. Refresh the page and observe:
   - **Cache Components:** The cached component shows the same timestamp
   - **ISR:** The entire page shows the same timestamp until revalidation
4. The "Client Fetch" section always shows fresh data (client-side)

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [Turborepo](https://turbo.build/repo) for monorepo management
- [Tailwind CSS](https://tailwindcss.com) for styling
- [pnpm](https://pnpm.io) for package management
