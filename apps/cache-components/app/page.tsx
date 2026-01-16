import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        Cache Components Weather Demo
      </h1>
      <p className="text-muted-foreground max-w-lg mb-8">
        Using <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">"use cache"</code> directive
        with <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">cacheLife</code> and
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">cacheTag</code> for granular caching.
      </p>

      <div className="grid gap-4 max-w-xl text-left text-sm">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">⚡ How Cache Components Work</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li>Each component caches independently</li>
            <li>Components stream in as they resolve</li>
            <li>Different TTLs per component via <code className="font-mono">cacheLife()</code></li>
            <li>On-demand revalidation via <code className="font-mono">cacheTag()</code></li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">🔑 Cache Tags Used</h3>
          <p className="text-muted-foreground">
            Same tags as ISR: <code className="font-mono">weather-current-{"{city}"}</code>,
            <code className="font-mono">weather-hourly-{"{city}"}</code>, etc.
          </p>
        </div>
      </div>

      <Link
        href="/new-york"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        View New York Weather →
      </Link>
    </div>
  );
}
