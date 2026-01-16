// Layout components
export { Header } from "./components/header";
export type { HeaderProps } from "./components/header";

export { Sidebar } from "./components/sidebar";
export type { SidebarProps, SidebarLink } from "./components/sidebar";

export { CreatedAt } from "./components/created-at";

export { Loading } from "./components/loading";

// Weather UI components
export { WeatherHero } from "./components/weather-hero";
export type { WeatherHeroProps } from "./components/weather-hero";

export { HourlyForecast } from "./components/hourly-forecast";
export type { HourlyForecastProps } from "./components/hourly-forecast";

export { DailyForecast } from "./components/daily-forecast";
export type { DailyForecastProps } from "./components/daily-forecast";

export { WeatherMap } from "./components/weather-map";
export type { WeatherMapProps } from "./components/weather-map";

export { AirQualityCard } from "./components/air-quality-card";
export type { AirQualityCardProps } from "./components/air-quality-card";

export { NewsCard, NewsGrid } from "./components/news-card";
export type { NewsCardProps, NewsGridProps } from "./components/news-card";

export { RelatedContent } from "./components/related-content";
export type { RelatedContentProps } from "./components/related-content";

export { RightSidebar } from "./components/right-sidebar";
export type { RightSidebarProps } from "./components/right-sidebar";

// Utilities
export { delay, withDelay } from "./lib/delay";
export {
  CACHE_TAGS,
  REVALIDATE,
  MOCK_DELAYS,
  CACHE_LIFE_PROFILES
} from "./lib/cache-config";

// Mock data fetchers
export {
  fetchCurrentWeather,
  fetchHourlyForecast,
  fetchDailyForecast,
  fetchWeatherMap,
  fetchAirQuality,
  fetchNewsArticles,
  fetchRelatedContent,
  // Synchronous versions for server rendering
  getNewsArticles,
  getRelatedContent,
  getEditorsPicks,
  getHealthArticles,
} from "./lib/mock-data";

// Types
export type {
  CurrentWeather,
  HourlyForecast as HourlyForecastData,
  DailyForecast as DailyForecastData,
  WeatherMapData,
  WeatherAlert,
  AirQualityData,
  NewsArticle,
  RelatedContent as RelatedContentData,
} from "./lib/weather-types";

export { CONDITION_ICONS, AQI_COLORS } from "./lib/weather-types";
