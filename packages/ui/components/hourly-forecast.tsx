import type { HourlyForecast as HourlyForecastData } from "../lib/weather-types";
import { CONDITION_ICONS } from "../lib/weather-types";

export interface HourlyForecastProps {
  forecast: HourlyForecastData[];
}

export function HourlyForecast({ forecast }: HourlyForecastProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Hourly Forecast
      </h2>
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
        {forecast.map((hour, i) => {
          const icon = CONDITION_ICONS[hour.conditionIcon] || "🌡️";
          return (
            <div
              key={i}
              className="flex min-w-[4.5rem] flex-col items-center gap-2 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/50"
            >
              <span className="text-xs font-medium text-muted-foreground">{hour.hour}</span>
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-semibold">{hour.temperature}°</span>
              {hour.precipChance > 20 && (
                <span className="text-xs text-blue-500">{hour.precipChance}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
