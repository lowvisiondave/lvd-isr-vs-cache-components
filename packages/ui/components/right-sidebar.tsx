import type { NewsArticle } from "../lib/weather-types";

export interface RightSidebarProps {
  editorsPicks: NewsArticle[];
  healthArticles: NewsArticle[];
}

export function RightSidebar({ editorsPicks, healthArticles }: RightSidebarProps) {
  return (
    <aside className="w-64 shrink-0 space-y-6 hidden xl:block">
      {/* Editor's Pick */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Editor's Pick
        </h3>
        <div className="space-y-4">
          {editorsPicks.slice(0, 2).map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="relative h-24 overflow-hidden rounded-lg mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary">
                {article.title}
              </h4>
            </article>
          ))}
        </div>
      </div>

      {/* Keeping You Healthy */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Keeping You Healthy
        </h3>
        <div className="space-y-3">
          {healthArticles.slice(0, 3).map((article) => (
            <article key={article.id} className="group cursor-pointer flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium leading-tight line-clamp-3 group-hover:text-primary">
                  {article.title}
                </h4>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Ad placeholder */}
      <div className="rounded-xl border bg-muted/50 p-4 text-center">
        <p className="text-xs text-muted-foreground">Advertisement</p>
        <div className="h-48 bg-muted rounded mt-2 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Ad Space</span>
        </div>
      </div>
    </aside>
  );
}
