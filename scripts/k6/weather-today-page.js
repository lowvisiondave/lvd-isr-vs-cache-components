/**
 * Weather Today Page Load Test
 *
 * Simulates realistic traffic patterns for a "weather today" page:
 * - Popular cities get most traffic (cache hits)
 * - Long-tail small towns get sparse traffic (cache misses)
 *
 * Target metrics:
 * - Strict HIT ratio: ~67.6%
 * - Practical CDN effectiveness: ~79–81%
 * - Miss rate: ~19%
 *
 * Distribution:
 * - POPULAR_ROUTES (100): ~50% of traffic, heavily cached
 * - MEDIUM_ROUTES (1000): ~25% of traffic, moderate caching
 * - LONG_TAIL_ROUTES (~17900): ~25% of traffic, mostly misses
 *
 * Usage:
 *   k6 run scripts/k6/weather-today-page.js \
 *     -e CACHE_URL=https://cache-components.vercel.app \
 *     -e ISR_URL=https://isr.vercel.app
 *
 * Options:
 *   -e VUS=50              Number of virtual users (default: 50)
 *   -e TOTAL_REQUESTS=100000  Total requests to make (default: 100000)
 *   -e POPULAR_ROUTES=100     Number of popular routes (default: 100)
 *   -e MEDIUM_ROUTES=1000     Number of medium routes (default: 1000)
 *   -e LONG_TAIL_ROUTES=17900 Number of long-tail routes (default: 17900)
 */

import { check, sleep } from "k6";
import execution from "k6/execution";
import http from "k6/http";
import { Counter, Rate, Trend } from "k6/metrics";
import {
	CACHE_URL,
	DEFAULT_DELAY,
	ISR_URL,
	buildUrl,
	defaultOptions,
	validateConfig,
} from "./config.js";

// Configuration (configurable via environment variables)
const TOTAL_REQUESTS = Number.parseInt(__ENV.TOTAL_REQUESTS || "100000", 10);
const VUS = Number.parseInt(__ENV.VUS || "50", 10);

// Route distribution for ~19% miss rate
// Total unique routes = POPULAR + MEDIUM + LONG_TAIL = ~19,000
const POPULAR_ROUTES = Number.parseInt(__ENV.POPULAR_ROUTES || "100", 10);
const MEDIUM_ROUTES = Number.parseInt(__ENV.MEDIUM_ROUTES || "1000", 10);
const LONG_TAIL_ROUTES = Number.parseInt(__ENV.LONG_TAIL_ROUTES || "17900", 10);

// Traffic distribution weights (should sum to 1.0)
const POPULAR_WEIGHT = 0.50; // 50% of traffic goes to popular routes
const MEDIUM_WEIGHT = 0.25; // 25% of traffic goes to medium routes
const LONG_TAIL_WEIGHT = 0.25; // 25% of traffic goes to long-tail routes

// Custom metrics for each app
const cacheRequests = new Counter("cache_requests");
const isrRequests = new Counter("isr_requests");
const cacheDuration = new Trend("cache_duration", true);
const isrDuration = new Trend("isr_duration", true);
const cacheErrors = new Counter("cache_errors");
const isrErrors = new Counter("isr_errors");

// Hit/miss tracking metrics
const cacheHitRate = new Rate("cache_estimated_hit_rate");
const isrHitRate = new Rate("isr_estimated_hit_rate");
const cacheMissDuration = new Trend("cache_miss_duration", true);
const cacheHitDuration = new Trend("cache_hit_duration", true);
const isrMissDuration = new Trend("isr_miss_duration", true);
const isrHitDuration = new Trend("isr_hit_duration", true);

// Route category metrics
const popularHits = new Counter("popular_route_requests");
const mediumHits = new Counter("medium_route_requests");
const longTailHits = new Counter("long_tail_route_requests");

export const options = {
	...defaultOptions,
	scenarios: {
		weather_today: {
			executor: "shared-iterations",
			vus: VUS,
			iterations: TOTAL_REQUESTS,
			maxDuration: "2h",
		},
	},
};

// Track which routes have been accessed (for hit/miss estimation)
// Using SharedArray would be better for large scale, but this works for our purposes
const accessedRoutes = {
	cache: new Set(),
	isr: new Set(),
};

// Generate city-like slug names for weather simulation
function generateCitySlug(category, index) {
	const prefixes = {
		popular: "metro",
		medium: "city",
		long_tail: "town",
	};
	return `${prefixes[category]}-${index}`;
}

// Weighted random selection to pick route category
function selectRouteCategory(rand) {
	if (rand < POPULAR_WEIGHT) {
		return "popular";
	} else if (rand < POPULAR_WEIGHT + MEDIUM_WEIGHT) {
		return "medium";
	} else {
		return "long_tail";
	}
}

// Get a random route based on weighted distribution
function getRandomRoute(iterationId) {
	// Use iteration ID to seed randomness (deterministic but distributed)
	const rand = (iterationId * 9301 + 49297) % 233280 / 233280;
	const category = selectRouteCategory(rand);

	// Secondary random for route selection within category
	const rand2 = (iterationId * 7919 + 13) % 104729 / 104729;

	let routeIndex;
	let slug;

	switch (category) {
		case "popular":
			// Within popular, use Zipf-like distribution (lower indices more popular)
			routeIndex = Math.floor(Math.pow(rand2, 2) * POPULAR_ROUTES);
			slug = generateCitySlug("popular", routeIndex);
			popularHits.add(1);
			break;
		case "medium":
			routeIndex = Math.floor(rand2 * MEDIUM_ROUTES);
			slug = generateCitySlug("medium", routeIndex);
			mediumHits.add(1);
			break;
		case "long_tail":
		default:
			routeIndex = Math.floor(rand2 * LONG_TAIL_ROUTES);
			slug = generateCitySlug("long_tail", routeIndex);
			longTailHits.add(1);
			break;
	}

	return { category, slug };
}

export function setup() {
	validateConfig();

	const totalUniqueRoutes = POPULAR_ROUTES + MEDIUM_ROUTES + LONG_TAIL_ROUTES;
	const expectedMissRate = (totalUniqueRoutes / TOTAL_REQUESTS * 100).toFixed(1);

	// Calculate expected hit distribution
	const expectedPopularHits = Math.floor(TOTAL_REQUESTS * POPULAR_WEIGHT);
	const expectedMediumHits = Math.floor(TOTAL_REQUESTS * MEDIUM_WEIGHT);
	const expectedLongTailHits = Math.floor(TOTAL_REQUESTS * LONG_TAIL_WEIGHT);

	console.log("=".repeat(60));
	console.log("Weather Today Page Load Test");
	console.log("=".repeat(60));
	console.log("");
	console.log("Target metrics:");
	console.log("  - Strict HIT ratio: ~67.6%");
	console.log("  - Practical CDN effectiveness: ~79-81%");
	console.log("  - Miss rate: ~19%");
	console.log("");
	console.log("Configuration:");
	console.log(`  Total requests: ${TOTAL_REQUESTS.toLocaleString()}`);
	console.log(`  Virtual users (VUs): ${VUS}`);
	console.log(`  Delay parameter: ${DEFAULT_DELAY}`);
	console.log("");
	console.log("Route distribution:");
	console.log(`  Popular routes: ${POPULAR_ROUTES.toLocaleString()} (${(POPULAR_WEIGHT * 100).toFixed(0)}% of traffic = ~${expectedPopularHits.toLocaleString()} reqs)`);
	console.log(`  Medium routes: ${MEDIUM_ROUTES.toLocaleString()} (${(MEDIUM_WEIGHT * 100).toFixed(0)}% of traffic = ~${expectedMediumHits.toLocaleString()} reqs)`);
	console.log(`  Long-tail routes: ${LONG_TAIL_ROUTES.toLocaleString()} (${(LONG_TAIL_WEIGHT * 100).toFixed(0)}% of traffic = ~${expectedLongTailHits.toLocaleString()} reqs)`);
	console.log(`  Total unique routes: ${totalUniqueRoutes.toLocaleString()}`);
	console.log(`  Expected miss rate: ~${expectedMissRate}%`);
	console.log("");
	console.log("URLs:");
	console.log(`  Cache Components: ${CACHE_URL}`);
	console.log(`  ISR: ${ISR_URL}`);
	console.log("=".repeat(60));

	return { startTime: Date.now() };
}

export default function (data) {
	const iterationId = execution.scenario.iterationInTest;
	const { category, slug } = getRandomRoute(iterationId);

	// Test cache-components app
	const cacheUrl = buildUrl(CACHE_URL, slug);
	const isFirstCacheHit = !accessedRoutes.cache.has(slug);

	const cacheRes = http.get(cacheUrl, {
		tags: { app: "cache-components", category: category },
		timeout: "30s",
	});

	cacheRequests.add(1);
	cacheDuration.add(cacheRes.timings.duration);

	// Track hit/miss for estimation
	if (isFirstCacheHit) {
		accessedRoutes.cache.add(slug);
		cacheMissDuration.add(cacheRes.timings.duration);
		cacheHitRate.add(0); // This is a miss
	} else {
		cacheHitDuration.add(cacheRes.timings.duration);
		cacheHitRate.add(1); // This is a hit
	}

	const cacheOk = check(cacheRes, {
		"cache-components status is 200": (r) => r.status === 200,
	});

	if (!cacheOk) {
		cacheErrors.add(1);
	}

	// Test ISR app
	const isrUrl = buildUrl(ISR_URL, slug);
	const isFirstIsrHit = !accessedRoutes.isr.has(slug);

	const isrRes = http.get(isrUrl, {
		tags: { app: "isr", category: category },
		timeout: "30s",
	});

	isrRequests.add(1);
	isrDuration.add(isrRes.timings.duration);

	// Track hit/miss for estimation
	if (isFirstIsrHit) {
		accessedRoutes.isr.add(slug);
		isrMissDuration.add(isrRes.timings.duration);
		isrHitRate.add(0); // This is a miss
	} else {
		isrHitDuration.add(isrRes.timings.duration);
		isrHitRate.add(1); // This is a hit
	}

	const isrOk = check(isrRes, {
		"isr status is 200": (r) => r.status === 200,
	});

	if (!isrOk) {
		isrErrors.add(1);
	}

	// Small sleep to prevent overwhelming the servers
	sleep(0.01);
}

export function teardown(data) {
	const duration = (Date.now() - data.startTime) / 1000;

	console.log("=".repeat(60));
	console.log(`Test completed in ${duration.toFixed(2)} seconds`);
	console.log("");
	console.log("Metrics explanation:");
	console.log("  - cache_estimated_hit_rate / isr_estimated_hit_rate:");
	console.log("    Estimated hit rate based on first vs repeated access");
	console.log("    (Note: actual CDN hit rate may differ due to cache TTL)");
	console.log("");
	console.log("  - cache_miss_duration / isr_miss_duration:");
	console.log("    Response times for first access to each route (likely cache miss)");
	console.log("");
	console.log("  - cache_hit_duration / isr_hit_duration:");
	console.log("    Response times for repeated access (likely cache hit)");
	console.log("");
	console.log("  - popular/medium/long_tail_route_requests:");
	console.log("    Request counts per route category");
	console.log("=".repeat(60));
}
