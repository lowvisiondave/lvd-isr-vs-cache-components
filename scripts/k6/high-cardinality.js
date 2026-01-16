/**
 * High Cardinality Load Test
 *
 * Tests unique routes to measure cache miss / on-demand generation performance.
 * Each route is only hit once, testing how well the system handles high cardinality.
 *
 * Usage:
 *   k6 run scripts/k6/high-cardinality.js \
 *     -e CACHE_URL=https://cache-components.vercel.app \
 *     -e ISR_URL=https://isr.vercel.app
 *
 * Options:
 *   -e VUS=50            Number of virtual users (default: 50)
 *   -e ITERATIONS=100000 Number of unique routes to test (default: 100000)
 */

import { check, sleep } from "k6";
import execution from "k6/execution";
import http from "k6/http";
import { Counter, Trend } from "k6/metrics";
import {
	CACHE_URL,
	ISR_URL,
	buildUrl,
	defaultOptions,
	generateSlug,
	validateConfig,
} from "./config.js";

// Configuration (configurable via environment variables)
const TOTAL_ROUTES = Number.parseInt(__ENV.ITERATIONS || "100000", 10);
const VUS = Number.parseInt(__ENV.VUS || "50", 10);

// Custom metrics for each app
const cacheRequests = new Counter("cache_requests");
const isrRequests = new Counter("isr_requests");
const cacheDuration = new Trend("cache_duration", true);
const isrDuration = new Trend("isr_duration", true);
const cacheErrors = new Counter("cache_errors");
const isrErrors = new Counter("isr_errors");

export const options = {
	...defaultOptions,
	scenarios: {
		high_cardinality: {
			executor: "shared-iterations",
			vus: VUS,
			iterations: TOTAL_ROUTES,
			maxDuration: "2h",
		},
	},
};

export function setup() {
	validateConfig();

	console.log("=".repeat(60));
	console.log("High Cardinality Load Test");
	console.log("=".repeat(60));
	console.log("");
	console.log("Configuration:");
	console.log(`  Total unique routes: ${TOTAL_ROUTES.toLocaleString()}`);
	console.log(`  Virtual users (VUs): ${VUS}`);
	console.log(`  Expected hit rate: 0% (each route hit once)`);
	console.log("");
	console.log("URLs:");
	console.log(`  Cache Components: ${CACHE_URL}`);
	console.log(`  ISR: ${ISR_URL}`);
	console.log("=".repeat(60));

	return { startTime: Date.now() };
}

export default function (data) {
	// Use global iteration counter across all VUs
	const iterationId = execution.scenario.iterationInTest;
	const slug = generateSlug(iterationId);

	// Test cache-components app
	const cacheUrl = buildUrl(CACHE_URL, slug);
	const cacheRes = http.get(cacheUrl, {
		tags: { app: "cache-components" },
		timeout: "30s",
	});

	cacheRequests.add(1);
	cacheDuration.add(cacheRes.timings.duration);

	const cacheOk = check(cacheRes, {
		"cache-components status is 200": (r) => r.status === 200,
	});

	if (!cacheOk) {
		cacheErrors.add(1);
	}

	// Test ISR app
	const isrUrl = buildUrl(ISR_URL, slug);
	const isrRes = http.get(isrUrl, {
		tags: { app: "isr" },
		timeout: "30s",
	});

	isrRequests.add(1);
	isrDuration.add(isrRes.timings.duration);

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
	console.log("  - cache_duration / isr_duration:");
	console.log("    Response times for cache miss (on-demand generation)");
	console.log("=".repeat(60));
}

