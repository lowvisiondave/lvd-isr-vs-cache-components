import type { AirQualityData } from "../lib/weather-types";
import { AQI_COLORS } from "../lib/weather-types";

export interface AirQualityCardProps {
  airQuality: AirQualityData;
}

export function AirQualityCard({ airQuality }: AirQualityCardProps) {
  const color = AQI_COLORS[airQuality.category] || "#888";
  const percentage = Math.min(100, (airQuality.aqi / 300) * 100);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Air Quality
      </h2>

      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {airQuality.aqi}
        </div>

        <div className="flex-1">
          <p className="font-semibold" style={{ color }}>
            {airQuality.category}
          </p>
          <p className="text-sm text-muted-foreground">
            Primary: {airQuality.primaryPollutant}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(to right, #00e400, #ffff00, #ff7e00, #ff0000, #8f3f97)`,
            }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-xs">
        <div>
          <p className="text-muted-foreground">PM2.5</p>
          <p className="font-medium">{airQuality.pm25} µg/m³</p>
        </div>
        <div>
          <p className="text-muted-foreground">PM10</p>
          <p className="font-medium">{airQuality.pm10} µg/m³</p>
        </div>
        <div>
          <p className="text-muted-foreground">O₃</p>
          <p className="font-medium">{airQuality.o3} ppb</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Updated {new Date(airQuality.fetchedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}
