/**
 * High Cardinality Load Test
 *
 * Tests 100,000 unique routes to measure cache miss / on-demand generation performance.
 * Each route is only hit once, testing how well the system handles high cardinality.
 *
 * Usage:
 *   k6 run scripts/k6/high-cardinality.js \
 *     -e CACHE_URL=https://cache-components.vercel.app \
 *     -e ISR_URL=https://isr.vercel.app
 *
 * Options:
 *   --vus 50         Number of virtual users (default: 50)
 *   --duration 0     Run until all iterations complete (default behavior)
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

// Total unique routes to test
const TOTAL_ROUTES = 100000;

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
			vus: 50,
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
	console.log(`Total unique routes: ${TOTAL_ROUTES.toLocaleString()}`);
	console.log(`Cache Components URL: ${CACHE_URL}`);
	console.log(`ISR URL: ${ISR_URL}`);
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
	console.log("=".repeat(60));
}
