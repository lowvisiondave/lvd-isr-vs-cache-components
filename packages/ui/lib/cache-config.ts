/**
 * Shared cache configuration for ISR (unstable_cache) and Cache Components ("use cache")
 * Both apps should use the same tags and revalidation periods for fair comparison
 */

// Cache tags - used for on-demand revalidation
export const CACHE_TAGS = {
	// Weather data tags
	weatherCurrent: (city: string) => `weather-current-${city}`,
	weatherHourly: (city: string) => `weather-hourly-${city}`,
	weatherDaily: (city: string) => `weather-daily-${city}`,
	weatherMap: (region: string) => `weather-map-${region}`,

	// Content tags
	airQuality: (city: string) => `air-quality-${city}`,
	newsArticles: () => `news-articles`,
	relatedContent: () => `related-content`,

	// Global tags
	allWeather: () => `weather-all`,
	allContent: () => `content-all`,
} as const;

// Revalidation period in seconds (1 day for all data types)
const ONE_DAY = 86400;

export const REVALIDATE = {
	weatherCurrent: ONE_DAY,
	weatherHourly: ONE_DAY,
	weatherDaily: ONE_DAY,
	weatherMap: ONE_DAY,
	airQuality: ONE_DAY,
	newsArticles: ONE_DAY,
	relatedContent: ONE_DAY,
	cityLookup: ONE_DAY,
	pageShell: ONE_DAY,
} as const;

// Simulated delays for each data type (in ms)
// These simulate real API response times
export const MOCK_DELAYS = {
	weatherCurrent: 150,
	weatherHourly: 200,
	weatherDaily: 250,
	weatherMap: 100,
	airQuality: 120,
	newsArticles: 180,
	relatedContent: 150,
} as const;

// Cache life profiles for "use cache" (cacheLife)
// These map to the revalidation periods above
export const CACHE_LIFE_PROFILES = {
	weatherCurrent: { revalidate: REVALIDATE.weatherCurrent },
	weatherHourly: { revalidate: REVALIDATE.weatherHourly },
	weatherDaily: { revalidate: REVALIDATE.weatherDaily },
	weatherMap: { revalidate: REVALIDATE.weatherMap },
	airQuality: { revalidate: REVALIDATE.airQuality },
	newsArticles: { revalidate: REVALIDATE.newsArticles },
	relatedContent: { revalidate: REVALIDATE.relatedContent },
	cityLookup: { revalidate: REVALIDATE.cityLookup },
	pageShell: { revalidate: REVALIDATE.pageShell },
} as const;
