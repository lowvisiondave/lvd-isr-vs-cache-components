/**
 * Repeated Access Load Test
 *
 * Tests 10,000 routes, each hit 10 times (100,000 total requests).
 * This tests cache hit performance after initial cache population.
 *
 * Usage:
 *   k6 run scripts/k6/repeated-access.js \
 *     -e CACHE_URL=https://cache-components.vercel.app \
 *     -e ISR_URL=https://isr.vercel.app
 *
 * Options:
 *   --vus 50         Number of virtual users (default: 50)
 */

import { check, sleep } from 'k6';
import execution from 'k6/execution';
import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';
import { validateConfig, CACHE_URL, ISR_URL, DEFAULT_DELAY, generateSlug, buildUrl, defaultOptions } from './config.js';

// Configuration (configurable via environment variables)
const UNIQUE_ROUTES = parseInt(__ENV.UNIQUE_ROUTES || '10000', 10);
const HITS_PER_ROUTE = parseInt(__ENV.HITS_PER_ROUTE || '10', 10);
const TOTAL_ITERATIONS = UNIQUE_ROUTES * HITS_PER_ROUTE;

// Custom metrics for each app
const cacheRequests = new Counter('cache_requests');
const isrRequests = new Counter('isr_requests');
const cacheDuration = new Trend('cache_duration', true);
const isrDuration = new Trend('isr_duration', true);
const cacheErrors = new Counter('cache_errors');
const isrErrors = new Counter('isr_errors');

// Separate metrics for first hit vs subsequent hits
const cacheFirstHit = new Trend('cache_first_hit_duration', true);
const cacheCacheHit = new Trend('cache_cache_hit_duration', true);
const isrFirstHit = new Trend('isr_first_hit_duration', true);
const isrCacheHit = new Trend('isr_cache_hit_duration', true);

export const options = {
  ...defaultOptions,
  scenarios: {
    repeated_access: {
      executor: 'shared-iterations',
      vus: 50,
      iterations: TOTAL_ITERATIONS,
      maxDuration: '2h',
    },
  },
};

export function setup() {
  validateConfig();

  console.log('='.repeat(60));
  console.log('Repeated Access Load Test');
  console.log('='.repeat(60));
  console.log(`Unique routes: ${UNIQUE_ROUTES.toLocaleString()}`);
  console.log(`Hits per route: ${HITS_PER_ROUTE}`);
  console.log(`Total requests: ${TOTAL_ITERATIONS.toLocaleString()}`);
  console.log(`Delay parameter: ${DEFAULT_DELAY}`);
  console.log(`Cache Components URL: ${CACHE_URL}`);
  console.log(`ISR URL: ${ISR_URL}`);
  console.log('='.repeat(60));

  return { startTime: Date.now() };
}

export default function (data) {
  // Calculate which route and which hit this is
  // We want to cycle through routes, hitting each one before moving to the next round
  // This simulates a more realistic access pattern where routes get multiple hits over time
  const globalIter = execution.scenario.iterationInTest;

  // Round-robin through routes across all iterations
  // First 10k iterations hit routes 0-9999 (first hit)
  // Next 10k iterations hit routes 0-9999 again (second hit), etc.
  const hitNumber = Math.floor(globalIter / UNIQUE_ROUTES); // 0-9 (which round of hits)
  const routeIndex = globalIter % UNIQUE_ROUTES; // 0-9999 (which route)

  const slug = generateSlug(routeIndex);
  const isFirstHit = hitNumber === 0;

  // Test cache-components app
  const cacheUrl = buildUrl(CACHE_URL, slug);
  const cacheRes = http.get(cacheUrl, {
    tags: { app: 'cache-components', hit_type: isFirstHit ? 'first' : 'cached' },
    timeout: '30s',
  });

  cacheRequests.add(1);
  cacheDuration.add(cacheRes.timings.duration);

  if (isFirstHit) {
    cacheFirstHit.add(cacheRes.timings.duration);
  } else {
    cacheCacheHit.add(cacheRes.timings.duration);
  }

  const cacheOk = check(cacheRes, {
    'cache-components status is 200': (r) => r.status === 200,
  });

  if (!cacheOk) {
    cacheErrors.add(1);
  }

  // Test ISR app
  const isrUrl = buildUrl(ISR_URL, slug);
  const isrRes = http.get(isrUrl, {
    tags: { app: 'isr', hit_type: isFirstHit ? 'first' : 'cached' },
    timeout: '30s',
  });

  isrRequests.add(1);
  isrDuration.add(isrRes.timings.duration);

  if (isFirstHit) {
    isrFirstHit.add(isrRes.timings.duration);
  } else {
    isrCacheHit.add(isrRes.timings.duration);
  }

  const isrOk = check(isrRes, {
    'isr status is 200': (r) => r.status === 200,
  });

  if (!isrOk) {
    isrErrors.add(1);
  }

  // Small sleep to prevent overwhelming the servers
  sleep(0.01);
}

export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log('='.repeat(60));
  console.log(`Test completed in ${duration.toFixed(2)} seconds`);
  console.log('');
  console.log('Custom metrics breakdown:');
  console.log('- cache_first_hit_duration: Response times for first access (cache miss)');
  console.log('- cache_cache_hit_duration: Response times for subsequent access (cache hit)');
  console.log('- isr_first_hit_duration: Response times for first access (cache miss)');
  console.log('- isr_cache_hit_duration: Response times for subsequent access (cache hit)');
  console.log('='.repeat(60));
}
