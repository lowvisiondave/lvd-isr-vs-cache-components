import type { CurrentWeather } from "../lib/weather-types";
import { CONDITION_ICONS } from "../lib/weather-types";

export interface WeatherHeroProps {
  weather: CurrentWeather;
}

export function WeatherHero({ weather }: WeatherHeroProps) {
  const icon = CONDITION_ICONS[weather.conditionIcon] || "🌡️";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-500/90 to-indigo-600/90 p-6 text-white shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{weather.city}</h1>
          <p className="mt-1 text-sm text-white/80">
            As of {new Date(weather.fetchedAt).toLocaleTimeString()}
          </p>
        </div>
        <span className="text-5xl">{icon}</span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-7xl font-light tracking-tighter">{weather.temperature}°</span>
        <span className="text-lg capitalize text-white/90">{weather.condition.replace("-", " ")}</span>
      </div>

      <p className="mt-2 text-sm text-white/80">
        Feels like {weather.feelsLike}°
      </p>

      <div className="mt-6 grid grid-cols-4 gap-4 border-t border-white/20 pt-4">
        <WeatherStat label="Humidity" value={`${weather.humidity}%`} />
        <WeatherStat label="Wind" value={`${weather.windSpeed} mph ${weather.windDirection}`} />
        <WeatherStat label="UV Index" value={weather.uvIndex.toString()} />
        <WeatherStat label="Visibility" value={`${weather.visibility} mi`} />
      </div>
    </div>
  );
}

function WeatherStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
