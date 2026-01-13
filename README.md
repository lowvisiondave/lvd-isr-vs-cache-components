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

## Load Testing

This repo includes [k6](https://k6.io) load testing scripts to benchmark both caching strategies at scale.

### Prerequisites

Install k6:

```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo apt install k6
```

### Test Scenarios

| Test | Description | Total Requests |
|------|-------------|----------------|
| **High Cardinality** | 100k unique routes (cache miss behavior) | 100,000 |
| **Repeated Access** | 10k routes × 10 hits each (cache hit behavior) | 100,000 |
| **Weather Today Page** | Realistic traffic with ~67.6% HIT / ~19% MISS rate | 100,000 |

### Running the Tests

```bash
# High cardinality test - tests cache miss / on-demand generation
k6 run scripts/k6/high-cardinality.js \
  -e CACHE_URL=https://lvd-cache-components.vercel.app \
  -e ISR_URL=https://lvd-isr.vercel.app \
  -e DELAY=500

# Repeated access test - tests cache hit performance
k6 run scripts/k6/repeated-access.js \
  -e CACHE_URL=https://lvd-cache-components.vercel.app \
  -e ISR_URL=https://lvd-isr.vercel.app \
  -e DELAY=500

# Weather today page test - realistic traffic distribution
k6 run scripts/k6/weather-today-page.js \
  -e CACHE_URL=https://lvd-cache-components.vercel.app \
  -e ISR_URL=https://lvd-isr.vercel.app \
  -e DELAY=500
```

### Options

**Common options:**
- `-e VUS=100` - Number of virtual users / concurrent connections (default: 50)
- `-e DELAY=500` - Delay parameter for routes `/{delay}/{slug}` (default: 0)

**High Cardinality options:**
- `-e ITERATIONS=1000` - Number of unique routes to test (default: 100000)

**Repeated Access options:**
- `-e UNIQUE_ROUTES=100` - Number of unique routes (default: 10000)
- `-e HITS_PER_ROUTE=5` - Hits per route (default: 10)

**Weather Today Page options:**
- `-e TOTAL_REQUESTS=100000` - Total requests to make (default: 100000)
- `-e POPULAR_ROUTES=100` - Number of popular routes / 50% traffic (default: 100)
- `-e MEDIUM_ROUTES=1000` - Number of medium routes / 25% traffic (default: 1000)
- `-e LONG_TAIL_ROUTES=17900` - Number of long-tail routes / 25% traffic (default: 17900)

### Metrics

k6 provides built-in metrics plus custom metrics per app:

- `cache_duration` / `isr_duration` - Response times per app
- `cache_errors` / `isr_errors` - Error counts per app
- `cache_first_hit_duration` / `isr_first_hit_duration` - First access times (repeated-access only)
- `cache_cache_hit_duration` / `isr_cache_hit_duration` - Subsequent access times (repeated-access only)
- `cache_estimated_hit_rate` / `isr_estimated_hit_rate` - Estimated hit rate (weather-today-page only)
- `cache_miss_duration` / `isr_miss_duration` - First access times (weather-today-page only)
- `cache_hit_duration` / `isr_hit_duration` - Repeated access times (weather-today-page only)
- `popular/medium/long_tail_route_requests` - Requests per category (weather-today-page only)

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [Turborepo](https://turbo.build/repo) for monorepo management
- [Tailwind CSS](https://tailwindcss.com) for styling
- [pnpm](https://pnpm.io) for package management
- [k6](https://k6.io) for load testing
