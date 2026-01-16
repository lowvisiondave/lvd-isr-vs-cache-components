import type { NewsArticle } from "../lib/weather-types";

export interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const timeAgo = getTimeAgo(article.publishedAt);

  return (
    <article className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative h-40 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imageUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          {article.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold leading-tight group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </article>
  );
}

export interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Weather News
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  // If already a relative time string, return as-is
  if (dateString.includes("ago")) return dateString;

  // Otherwise parse as ISO date
  const now = new Date();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
