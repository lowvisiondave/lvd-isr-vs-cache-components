"use client";

import { useEffect, useState } from "react";
import {
	WeatherHero,
	HourlyForecast,
	DailyForecast,
	WeatherMap,
	AirQualityCard,
	type CurrentWeather,
	type HourlyForecastData,
	type DailyForecastData,
	type WeatherMapData,
	type AirQualityData,
} from "@repo/ui";

// Skeleton components for loading states (visible with JS disabled)
function HeroSkeleton() {
	return (
		<div className="rounded-2xl bg-gradient-to-br from-blue-500/50 to-indigo-600/50 p-6 animate-pulse">
			<div className="h-8 w-48 bg-white/20 rounded mb-4" />
			<div className="h-20 w-32 bg-white/20 rounded mb-4" />
			<div className="h-4 w-24 bg-white/20 rounded mb-6" />
			<div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/20">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-12 bg-white/20 rounded" />
				))}
			</div>
		</div>
	);
}

function HourlyForecastSkeleton() {
	return (
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
	);
}

function MapSkeleton() {
	return (
		<div className="rounded-xl border bg-card overflow-hidden animate-pulse">
			<div className="h-48 bg-muted" />
		</div>
	);
}

function AirQualitySkeleton() {
	return (
		<div className="rounded-xl border bg-card p-4 animate-pulse">
			<div className="h-5 w-24 bg-muted rounded mb-4" />
			<div className="flex items-center gap-4">
				<div className="h-16 w-16 bg-muted rounded-full" />
				<div className="flex-1">
					<div className="h-5 w-24 bg-muted rounded mb-2" />
					<div className="h-4 w-32 bg-muted rounded" />
				</div>
			</div>
		</div>
	);
}

function DailyForecastSkeleton() {
	return (
		<div className="rounded-xl border bg-card p-4 animate-pulse">
			<div className="h-5 w-32 bg-muted rounded mb-4" />
			{[...Array(10)].map((_, i) => (
				<div key={i} className="h-12 bg-muted rounded mb-2" />
			))}
		</div>
	);
}

// Client components that fetch weather data from API routes
export function CurrentWeatherClient({ city }: { city: string }) {
	const [data, setData] = useState<CurrentWeather | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/weather/${city}/current`)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, [city]);

	if (loading || !data) return <HeroSkeleton />;
	return <WeatherHero weather={data} />;
}

export function HourlyForecastClient({ city }: { city: string }) {
	const [data, setData] = useState<HourlyForecastData[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/weather/${city}/hourly`)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, [city]);

	if (loading || !data) return <HourlyForecastSkeleton />;
	return <HourlyForecast forecast={data} />;
}

export function DailyForecastClient({ city }: { city: string }) {
	const [data, setData] = useState<DailyForecastData[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/weather/${city}/daily`)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, [city]);

	if (loading || !data) return <DailyForecastSkeleton />;
	return <DailyForecast forecast={data} />;
}

export function WeatherMapClient({ city }: { city: string }) {
	const [data, setData] = useState<WeatherMapData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/weather/${city}/map`)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, [city]);

	if (loading || !data) return <MapSkeleton />;
	return <WeatherMap mapData={data} />;
}

export function AirQualityClient({ city }: { city: string }) {
	const [data, setData] = useState<AirQualityData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/weather/${city}/air-quality`)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, [city]);

	if (loading || !data) return <AirQualitySkeleton />;
	return <AirQualityCard airQuality={data} />;
}
