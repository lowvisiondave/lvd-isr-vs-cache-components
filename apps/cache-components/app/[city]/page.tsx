import {
	AirQualityClient,
	CurrentWeatherClient,
	DailyForecastClient,
	HourlyForecastClient,
	WeatherMapClient,
} from "@/components/weather-client";
import {
	CACHE_LIFE_PROFILES,
	NewsGrid,
	RelatedContent,
	RightSidebar,
	delay,
	getEditorsPicks,
	getHealthArticles,
	getNewsArticles,
	getRelatedContent,
} from "@repo/ui";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

type PageProps = {
	params: Promise<{ city: string }>;
};

// Cached city lookup - simulates looking up city info from a database/API
async function lookupCity(citySlug: string) {
	"use cache";
	cacheLife(CACHE_LIFE_PROFILES.cityLookup);

	// Simulate 100-200ms database lookup
	await delay(100 + Math.random() * 100);

	return citySlug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

export async function generateMetadata({ params }: PageProps) {
	const { city } = await params;
	const formattedCity = await lookupCity(city);

	return {
		title: `${formattedCity} Weather Today | Cache Components Demo`,
		description: `Current weather conditions and forecast for ${formattedCity}`,
	};
}

// Page header component with city info
async function PageHeader({ params }: { params: Promise<{ city: string }> }) {
	const { city } = await params;
	const formattedCity = await lookupCity(city);
	const timestamp = new Date().toISOString();

	return (
		<div className="flex items-center justify-between flex-wrap gap-4">
			<div>
				<h1 className="text-2xl font-bold">{formattedCity} Weather</h1>
				<p className="text-sm text-muted-foreground">
					Page rendered at: <code className="font-mono">{timestamp}</code>
				</p>
			</div>
			<div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
				Weather data fetched client-side
			</div>
		</div>
	);
}

function PageHeaderSkeleton() {
	return (
		<div className="flex items-center justify-between flex-wrap gap-4 animate-pulse">
			<div>
				<div className="h-8 w-48 bg-muted rounded mb-2" />
				<div className="h-4 w-64 bg-muted rounded" />
			</div>
			<div className="h-6 w-40 bg-muted rounded-full" />
		</div>
	);
}

// Client weather components wrapper - just passes city to client components
async function WeatherWidgets({
	params,
}: { params: Promise<{ city: string }> }) {
	const { city } = await params;

	return (
		<>
			<CurrentWeatherClient city={city} />
			<HourlyForecastClient city={city} />

			<div className="grid gap-6 lg:grid-cols-2">
				<WeatherMapClient city={city} />
				<AirQualityClient city={city} />
			</div>

			<DailyForecastClient city={city} />
		</>
	);
}

function WeatherWidgetsSkeleton() {
	return (
		<>
			{/* Hero skeleton */}
			<div className="rounded-2xl bg-gradient-to-br from-blue-500/50 to-indigo-600/50 p-6 animate-pulse">
				<div className="h-8 w-48 bg-white/20 rounded mb-4" />
				<div className="h-20 w-32 bg-white/20 rounded mb-4" />
				<div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/20">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-12 bg-white/20 rounded" />
					))}
				</div>
			</div>
			{/* Hourly skeleton */}
			<div className="rounded-xl border bg-card p-4">
				<div className="h-5 w-32 bg-muted rounded mb-4" />
				<div className="flex gap-2 overflow-hidden">
					{[...Array(12)].map((_, i) => (
						<div
							key={i}
							className="min-w-[4.5rem] h-24 bg-muted rounded-lg animate-pulse"
						/>
					))}
				</div>
			</div>
		</>
	);
}

export default function CityWeatherPage({ params }: PageProps) {
	// Server-rendered content - these are synchronous and render immediately
	const newsArticles = getNewsArticles();
	const relatedContent = getRelatedContent();
	const editorsPicks = getEditorsPicks();
	const healthArticles = getHealthArticles();

	return (
		<div className="flex gap-6">
			{/* Main content */}
			<div className="flex-1 min-w-0 space-y-6">
				{/* Page header - server rendered with suspense for async city lookup */}
				<Suspense fallback={<PageHeaderSkeleton />}>
					<PageHeader params={params} />
				</Suspense>

				{/* Weather widgets - client-fetched, wrapped in Suspense */}
				<Suspense fallback={<WeatherWidgetsSkeleton />}>
					<WeatherWidgets params={params} />
				</Suspense>

				{/* Server-rendered content - NO Suspense, renders immediately */}
				<NewsGrid articles={newsArticles} />
				<RelatedContent content={relatedContent} />

				{/* Footer with info */}
				<div className="rounded-lg border bg-muted/50 p-4 text-xs text-muted-foreground">
					<p className="font-semibold mb-2">Hybrid Rendering Pattern:</p>
					<ul className="space-y-1 list-disc list-inside">
						<li>
							<strong>Server-rendered:</strong> Page header, news articles,
							related content, right sidebar
						</li>
						<li>
							<strong>Client-fetched:</strong> Current weather, hourly forecast,
							daily forecast, radar map, air quality
						</li>
						<li>With JS disabled, weather sections show skeletons</li>
					</ul>
				</div>
			</div>

			{/* Right sidebar - server rendered */}
			<RightSidebar
				editorsPicks={editorsPicks}
				healthArticles={healthArticles}
			/>
		</div>
	);
}
