import type { WeatherMapData } from "../lib/weather-types";

export interface WeatherMapProps {
  mapData: WeatherMapData;
}

export function WeatherMap({ mapData }: WeatherMapProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mapData.mapUrl}
          alt={`Weather radar for ${mapData.region}`}
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-lg font-semibold text-white">{mapData.region} Radar</h2>
          <p className="text-xs text-white/80">
            Updated {new Date(mapData.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {mapData.alerts.length > 0 && (
        <div className="border-t p-3">
          {mapData.alerts.map((alert, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                alert.severity === "severe" || alert.severity === "extreme"
                  ? "bg-red-500/10 text-red-600"
                  : alert.severity === "moderate"
                  ? "bg-orange-500/10 text-orange-600"
                  : "bg-yellow-500/10 text-yellow-600"
              }`}
            >
              <span className="text-lg">⚠️</span>
              <span className="font-medium">{alert.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
