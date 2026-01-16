import {
	AirQualityClient,
	CurrentWeatherClient,
	DailyForecastClient,
	HourlyForecastClient,
	WeatherMapClient,
} from "@/components/weather-client";
import {
	NewsGrid,
	RelatedContent,
	RightSidebar,
	delay,
	getEditorsPicks,
	getHealthArticles,
	getNewsArticles,
	getRelatedContent,
} from "@repo/ui";

export const dynamic = "force-static";

type PageProps = {
	params: Promise<{ city: string }>;
};

// City lookup - simulates looking up city info from a database/API
async function lookupCity(citySlug: string) {
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
		title: `${formattedCity} Weather Today | ISR Demo`,
		description: `Current weather conditions and forecast for ${formattedCity}`,
	};
}

export default async function CityWeatherPage({ params }: PageProps) {
	const { city } = await params;
	const formattedCity = await lookupCity(city);
	const timestamp = new Date().toISOString();

	// Server-rendered content - renders at build time
	const newsArticles = getNewsArticles();
	const relatedContent = getRelatedContent();
	const editorsPicks = getEditorsPicks();
	const healthArticles = getHealthArticles();

	return (
		<div className="flex gap-6">
			{/* Main content */}
			<div className="flex-1 min-w-0 space-y-6">
				{/* Page header - server rendered at build time */}
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div>
						<h1 className="text-2xl font-bold">{formattedCity} Weather</h1>
						<p className="text-sm text-muted-foreground">
							Page rendered at: <code className="font-mono">{timestamp}</code>
						</p>
					</div>
					<div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
						ISR • Weather data fetched client-side
					</div>
				</div>

				{/* Client-fetched weather data - renders skeletons without JS */}
				<CurrentWeatherClient city={city} />
				<HourlyForecastClient city={city} />

				<div className="grid gap-6 lg:grid-cols-2">
					<WeatherMapClient city={city} />
					<AirQualityClient city={city} />
				</div>

				<DailyForecastClient city={city} />

				{/* Server-rendered content sections - visible without JS */}
				<NewsGrid articles={newsArticles} />
				<RelatedContent content={relatedContent} />

				{/* Footer with info */}
				<div className="rounded-lg border bg-muted/50 p-4 text-xs text-muted-foreground">
					<p className="font-semibold mb-2">ISR + Hybrid Rendering Pattern:</p>
					<ul className="space-y-1 list-disc list-inside">
						<li>
							<strong>Server-rendered (at build time):</strong> Page header, news
							articles, related content, right sidebar
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
