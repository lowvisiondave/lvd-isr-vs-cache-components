# ISR vs Cache Components Demo

A side-by-side comparison of Next.js **ISR (Incremental Static Regeneration)** vs **Cache Components** (`"use cache"` directive) using a weather app example.

## What's Inside

This monorepo demonstrates two different caching strategies in Next.js:

| App | Port | Caching Strategy |
|-----|------|-----------------|
| `apps/cache-components` | 3000 | Uses `"use cache"` directive for granular component-level caching |
| `apps/isr` | 3001 | Uses ISR with `force-static` for page-level caching |

### Key Differences

**Cache Components (`"use cache"`):**
- Component-level caching granularity
- Cache individual async components independently
- Different TTLs per component via `cacheLife()`
- On-demand revalidation via `cacheTag()`

**ISR:**
- Page-level caching with `force-static`
- Entire page cached as one unit
- Uses `unstable_cache` for data-level TTLs
- Page HTML regenerates atomically

### Cache TTL

Both apps use a **1 day** revalidation period for all cached data (weather, news, etc.) for simplicity and fair comparison.

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
│   └── ui/                  # Shared UI components and mock data
├── scripts/
│   └── k6/                  # Load testing scripts
└── package.json
```

## How to Test

1. Navigate to any city page (e.g., `/new-york`)
2. Note the "Page rendered at" timestamp
3. Refresh the page and observe:
   - **Cache Components:** The cached component shows the same timestamp
   - **ISR:** The entire page shows the same timestamp until revalidation
4. Weather data is fetched client-side in both apps for fair comparison

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

| Test | Description | Default Requests |
|------|-------------|------------------|
| **High Cardinality** | Unique routes only (100% cache miss) | 100,000 |
| **Repeated Access** | Routes hit multiple times (90% cache hit) | 100,000 |
| **Weather Today** | Realistic traffic distribution (~33% hit / ~67% miss) | 100,000 |

### Running the Tests

```bash
# High cardinality test - tests cache miss / on-demand generation
k6 run scripts/k6/high-cardinality.js \
  -e CACHE_URL=https://lvd-cache-components.vercel.app \
  -e ISR_URL=https://lvd-isr.vercel.app

# Repeated access test - tests cache hit performance
k6 run scripts/k6/repeated-access.js \
  -e CACHE_URL=https://lvd-cache-components.vercel.app \
  -e ISR_URL=https://lvd-isr.vercel.app

# Weather today page test - realistic traffic distribution
k6 run scripts/k6/weather-today-page.js \
  -e CACHE_URL=https://lvd-cache-components.vercel.app \
  -e ISR_URL=https://lvd-isr.vercel.app
```

### Options

**Common options:**
- `-e VUS=100` - Number of virtual users / concurrent connections (default: 50)

**High Cardinality options:**
- `-e ITERATIONS=1000` - Number of unique routes to test (default: 100000)

**Repeated Access options:**
- `-e UNIQUE_ROUTES=100` - Number of unique routes (default: 10000)
- `-e HITS_PER_ROUTE=5` - Hits per route (default: 10)

**Weather Today Page options:**
- `-e TOTAL_REQUESTS=1000000` - Total requests to make (default: 100000)
- `-e TARGET_MISS_RATE=0.67` - Target cache miss rate (default: 0.67)

Route distribution auto-scales based on `TOTAL_REQUESTS` and `TARGET_MISS_RATE`.

### Metrics

k6 provides built-in metrics plus custom metrics per app:

| Metric | Description | Test |
|--------|-------------|------|
| `cache_duration` / `isr_duration` | Response times per app | All |
| `cache_errors` / `isr_errors` | Error counts per app | All |
| `cache_first_hit_duration` / `isr_first_hit_duration` | First access times | repeated-access |
| `cache_cache_hit_duration` / `isr_cache_hit_duration` | Subsequent access times | repeated-access |
| `cache_estimated_hit_rate` / `isr_estimated_hit_rate` | Estimated hit rate | weather-today |
| `cache_miss_duration` / `isr_miss_duration` | First access times | weather-today |
| `cache_hit_duration` / `isr_hit_duration` | Repeated access times | weather-today |
| `popular/medium/long_tail_route_requests` | Requests per category | weather-today |

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [Turborepo](https://turbo.build/repo) for monorepo management
- [Tailwind CSS](https://tailwindcss.com) for styling
- [pnpm](https://pnpm.io) for package management
- [k6](https://k6.io) for load testing
