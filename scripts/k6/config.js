/**
 * Shared configuration for k6 load tests
 *
 * Environment variables:
 * - CACHE_URL: Base URL for cache-components app (required)
 * - ISR_URL: Base URL for ISR app (required)
 */

// Get URLs from environment variables
export const CACHE_URL = __ENV.CACHE_URL;
export const ISR_URL = __ENV.ISR_URL;

// Validate required environment variables
export function validateConfig() {
	if (!CACHE_URL) {
		throw new Error(
			"CACHE_URL environment variable is required. Pass it with -e CACHE_URL=https://...",
		);
	}
	if (!ISR_URL) {
		throw new Error(
			"ISR_URL environment variable is required. Pass it with -e ISR_URL=https://...",
		);
	}
}

// Common k6 options
export const defaultOptions = {
	// Thresholds for pass/fail criteria
	thresholds: {
		http_req_duration: ["p(95)<2000"], // 95% of requests should be under 2s
		http_req_failed: ["rate<0.05"], // Less than 5% failure rate
	},
};

// Default delay parameter for routes (/{delay}/{slug})
export const DEFAULT_DELAY = __ENV.DELAY || "0";

// Generate a slug for a given index
export function generateSlug(index) {
	return `test-${index}`;
}

// Build full URL for a given base URL, delay, and slug
// Route structure: /{delay}/{slug}
export function buildUrl(baseUrl, slug, delay = DEFAULT_DELAY) {
	return `${baseUrl}/${delay}/${slug}`;
}
