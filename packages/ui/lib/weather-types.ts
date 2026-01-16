/**
 * Shared weather data types used across both ISR and Cache Components apps
 */

export interface CurrentWeather {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionIcon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  visibility: number;
  pressure: number;
  dewPoint: number;
  fetchedAt: string;
}

export interface HourlyForecast {
  hour: string;
  temperature: number;
  condition: string;
  conditionIcon: string;
  precipChance: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  conditionIcon: string;
  precipChance: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherMapData {
  region: string;
  mapUrl: string;
  lastUpdated: string;
  alerts: WeatherAlert[];
}

export interface WeatherAlert {
  type: "warning" | "watch" | "advisory";
  title: string;
  severity: "minor" | "moderate" | "severe" | "extreme";
}

export interface AirQualityData {
  city: string;
  aqi: number;
  category: "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  primaryPollutant: string;
  pm25: number;
  pm10: number;
  o3: number;
  fetchedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
}

export interface RelatedContent {
  id: string;
  title: string;
  type: "gallery" | "video" | "article";
  thumbnailUrl: string;
}

// Weather condition icons (emoji for simplicity)
export const CONDITION_ICONS: Record<string, string> = {
  sunny: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  rainy: "🌧️",
  stormy: "⛈️",
  snowy: "🌨️",
  foggy: "🌫️",
  windy: "💨",
  clear: "🌙",
};

// AQI category colors
export const AQI_COLORS: Record<string, string> = {
  Good: "#00e400",
  Moderate: "#ffff00",
  "Unhealthy for Sensitive Groups": "#ff7e00",
  Unhealthy: "#ff0000",
  "Very Unhealthy": "#8f3f97",
  Hazardous: "#7e0023",
};
