import type { RelatedContent as RelatedContentData } from "../lib/weather-types";

export interface RelatedContentProps {
  content: RelatedContentData[];
}

export function RelatedContent({ content }: RelatedContentProps) {
  const typeIcons: Record<RelatedContentData["type"], string> = {
    gallery: "📷",
    video: "🎬",
    article: "📰",
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Related Content
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {content.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer overflow-hidden rounded-lg"
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute left-2 top-2 text-lg">{typeIcons[item.type]}</span>
              <p className="absolute bottom-2 left-2 right-2 line-clamp-2 text-xs font-medium text-white">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
