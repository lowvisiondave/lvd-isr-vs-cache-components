import type { DailyForecast as DailyForecastData } from "../lib/weather-types";
import { CONDITION_ICONS } from "../lib/weather-types";

export interface DailyForecastProps {
  forecast: DailyForecastData[];
}

export function DailyForecast({ forecast }: DailyForecastProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        10-Day Forecast
      </h2>
      <div className="divide-y">
        {forecast.map((day, i) => {
          const icon = CONDITION_ICONS[day.conditionIcon] || "🌡️";
          return (
            <div
              key={i}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="w-20">
                <p className="font-medium">{day.day}</p>
                <p className="text-xs text-muted-foreground">{day.date}</p>
              </div>

              <span className="text-2xl">{icon}</span>

              <div className="flex flex-1 items-center gap-2">
                {day.precipChance > 20 && (
                  <span className="text-xs text-blue-500">{day.precipChance}%</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 text-right font-semibold">{day.high}°</span>
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-400" />
                <span className="w-10 text-muted-foreground">{day.low}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
