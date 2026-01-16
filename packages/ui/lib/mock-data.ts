/**
 * Mock data generators for weather components
 * These simulate real API responses with consistent data based on city/region
 */

import type {
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  WeatherMapData,
  AirQualityData,
  NewsArticle,
  RelatedContent,
} from "./weather-types";
import { delay } from "./delay";
import { MOCK_DELAYS } from "./cache-config";

// Simple hash function for deterministic "random" values based on string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Seeded random based on city name for consistency
function seededRandom(seed: string, offset = 0): number {
  return (hashCode(seed + offset.toString()) % 1000) / 1000;
}

const CONDITIONS = ["sunny", "partly-cloudy", "cloudy", "rainy", "stormy", "snowy", "foggy", "clear"] as const;
const WIND_DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * Generate current weather data for a city
 */
export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  await delay(MOCK_DELAYS.weatherCurrent);

  const rand = seededRandom(city);
  const baseTemp = 40 + rand * 60; // 40-100°F range

  return {
    city: formatCityName(city),
    temperature: Math.round(baseTemp),
    feelsLike: Math.round(baseTemp + (seededRandom(city, 1) - 0.5) * 10),
    condition: CONDITIONS[Math.floor(seededRandom(city, 2) * CONDITIONS.length)],
    conditionIcon: CONDITIONS[Math.floor(seededRandom(city, 2) * CONDITIONS.length)],
    humidity: Math.round(30 + seededRandom(city, 3) * 60),
    windSpeed: Math.round(seededRandom(city, 4) * 25),
    windDirection: WIND_DIRECTIONS[Math.floor(seededRandom(city, 5) * WIND_DIRECTIONS.length)],
    uvIndex: Math.round(seededRandom(city, 6) * 11),
    visibility: Math.round(5 + seededRandom(city, 7) * 10),
    pressure: Math.round(29.5 + seededRandom(city, 8) * 1.5),
    dewPoint: Math.round(baseTemp - 10 - seededRandom(city, 9) * 20),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Generate hourly forecast for next 24 hours
 */
export async function fetchHourlyForecast(city: string): Promise<HourlyForecast[]> {
  await delay(MOCK_DELAYS.weatherHourly);

  const currentHour = new Date().getHours();
  const baseTemp = 40 + seededRandom(city) * 60;

  return Array.from({ length: 24 }, (_, i) => {
    const hour = (currentHour + i) % 24;
    const hourLabel = i === 0 ? "Now" : `${hour % 12 || 12}${hour < 12 ? "AM" : "PM"}`;
    const tempVariation = Math.sin((hour / 24) * Math.PI * 2) * 15;

    return {
      hour: hourLabel,
      temperature: Math.round(baseTemp + tempVariation + (seededRandom(city, i) - 0.5) * 5),
      condition: CONDITIONS[Math.floor(seededRandom(city, i + 100) * CONDITIONS.length)],
      conditionIcon: CONDITIONS[Math.floor(seededRandom(city, i + 100) * CONDITIONS.length)],
      precipChance: Math.round(seededRandom(city, i + 200) * 100),
    };
  });
}

/**
 * Generate 10-day forecast
 */
export async function fetchDailyForecast(city: string): Promise<DailyForecast[]> {
  await delay(MOCK_DELAYS.weatherDaily);

  const today = new Date();
  const baseTemp = 40 + seededRandom(city) * 60;

  return Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAYS[date.getDay()];
    const highVariation = (seededRandom(city, i + 300) - 0.5) * 20;
    const high = Math.round(baseTemp + 10 + highVariation);

    return {
      day: dayName,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      high,
      low: Math.round(high - 15 - seededRandom(city, i + 400) * 10),
      condition: CONDITIONS[Math.floor(seededRandom(city, i + 500) * CONDITIONS.length)],
      conditionIcon: CONDITIONS[Math.floor(seededRandom(city, i + 500) * CONDITIONS.length)],
      precipChance: Math.round(seededRandom(city, i + 600) * 100),
      humidity: Math.round(30 + seededRandom(city, i + 700) * 60),
      windSpeed: Math.round(seededRandom(city, i + 800) * 25),
    };
  });
}

/**
 * Generate weather map data for a region
 */
export async function fetchWeatherMap(region: string): Promise<WeatherMapData> {
  await delay(MOCK_DELAYS.weatherMap);

  const hasAlerts = seededRandom(region) > 0.7;

  return {
    region: formatCityName(region),
    mapUrl: `https://picsum.photos/seed/${region}/600/400`,
    lastUpdated: new Date().toISOString(),
    alerts: hasAlerts ? [
      {
        type: seededRandom(region, 1) > 0.5 ? "warning" : "watch",
        title: seededRandom(region, 2) > 0.5 ? "Winter Storm Warning" : "Flood Watch",
        severity: seededRandom(region, 3) > 0.5 ? "moderate" : "minor",
      }
    ] : [],
  };
}

/**
 * Generate air quality data for a city
 */
export async function fetchAirQuality(city: string): Promise<AirQualityData> {
  await delay(MOCK_DELAYS.airQuality);

  const aqi = Math.round(seededRandom(city) * 200);

  let category: AirQualityData["category"];
  if (aqi <= 50) category = "Good";
  else if (aqi <= 100) category = "Moderate";
  else if (aqi <= 150) category = "Unhealthy for Sensitive Groups";
  else if (aqi <= 200) category = "Unhealthy";
  else if (aqi <= 300) category = "Very Unhealthy";
  else category = "Hazardous";

  const pollutants = ["PM2.5", "O3", "PM10", "NO2"] as const;

  return {
    city: formatCityName(city),
    aqi,
    category,
    primaryPollutant: pollutants[Math.floor(seededRandom(city, 1) * pollutants.length)],
    pm25: Math.round(seededRandom(city, 2) * 50),
    pm10: Math.round(seededRandom(city, 3) * 100),
    o3: Math.round(seededRandom(city, 4) * 80),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Generate news articles (synchronous version for server rendering)
 */
export function getNewsArticles(): NewsArticle[] {
  const categories = ["Breaking", "Climate", "Severe Weather", "Forecast", "Science"];
  const titles = [
    "Major Storm System Approaching the Midwest",
    "Record-Breaking Temperatures Expected This Week",
    "Climate Scientists Release New Study on Weather Patterns",
    "Hurricane Season Forecast: What to Expect",
    "Snow Drought Affecting Western Water Supplies",
    "Heat Wave Warning Issued for Southern States",
  ];

  // Use relative time strings instead of Date.now() for cache compatibility
  const timeAgo = ["45m ago", "1h ago", "2h ago", "3h ago"];

  return titles.slice(0, 4).map((title, i) => ({
    id: `news-${i}`,
    title,
    excerpt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.`,
    imageUrl: `https://picsum.photos/seed/news${i}/400/300`,
    category: categories[i % categories.length],
    publishedAt: timeAgo[i] || "4h ago",
  }));
}

/**
 * Generate news articles (async version with delay)
 */
export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  await delay(MOCK_DELAYS.newsArticles);
  return getNewsArticles();
}

/**
 * Generate related content (synchronous version for server rendering)
 */
export function getRelatedContent(): RelatedContent[] {
  const types: RelatedContent["type"][] = ["gallery", "video", "article", "gallery", "video", "article"];
  const titles = [
    "Amazing Storm Photos from Last Night",
    "How Weather Radar Works",
    "Preparing for Winter: Essential Tips",
    "Rainbow Over the City",
    "Understanding Cloud Formations",
    "Best Weather Apps Reviewed",
  ];

  return titles.map((title, i) => ({
    id: `content-${i}`,
    title,
    type: types[i],
    thumbnailUrl: `https://picsum.photos/seed/content${i}/300/200`,
  }));
}

/**
 * Generate related content (async version with delay)
 */
export async function fetchRelatedContent(): Promise<RelatedContent[]> {
  await delay(MOCK_DELAYS.relatedContent);
  return getRelatedContent();
}

/**
 * Generate editor's picks for right sidebar
 */
export function getEditorsPicks(): NewsArticle[] {
  const titles = [
    "Astronauts Splash Down in NASA's First-Ever Medical Evacuation",
    "Why You're Always Cold (Hint: It's Not The Weather)",
    "Your Holiday Allergies Might Be Christmas Tree Syndrome",
    "How Cold Weather Can Boost Your Athletic Performance",
  ];

  const timeAgo = ["2h ago", "4h ago", "6h ago", "8h ago"];

  return titles.map((title, i) => ({
    id: `editors-${i}`,
    title,
    excerpt: "",
    imageUrl: `https://picsum.photos/seed/editor${i}/200/150`,
    category: "Featured",
    publishedAt: timeAgo[i] || "10h ago",
  }));
}

/**
 * Generate health articles for right sidebar
 */
export function getHealthArticles(): NewsArticle[] {
  const titles = [
    "Winter Norovirus Numbers On The Rise Again",
    "Why You're Always Cold (Hint: It's Not The Weather)",
    "Your Holiday Allergies Might Be Christmas Tree Syndrome",
  ];

  const timeAgo = ["1h ago", "3h ago", "5h ago"];

  return titles.map((title, i) => ({
    id: `health-${i}`,
    title,
    excerpt: "",
    imageUrl: `https://picsum.photos/seed/health${i}/200/150`,
    category: "Health",
    publishedAt: timeAgo[i] || "6h ago",
  }));
}

// Helper to format city slugs into readable names
function formatCityName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
