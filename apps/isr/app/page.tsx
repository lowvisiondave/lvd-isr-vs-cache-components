import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        ISR Weather Demo
      </h1>
      <p className="text-muted-foreground max-w-lg mb-8">
        Using <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">unstable_cache</code> for
        data-level caching with <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">force-static</code> pages.
      </p>

      <div className="grid gap-4 max-w-xl text-left text-sm">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">📦 How ISR Works</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li>Entire page is statically generated</li>
            <li>All data fetched at build/revalidation time</li>
            <li>Uses <code className="font-mono">unstable_cache</code> for per-data TTLs</li>
            <li>Page HTML regenerates atomically</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">🔑 Cache Tags Used</h3>
          <p className="text-muted-foreground">
            Same tags as Cache Components: <code className="font-mono">weather-current-{"{city}"}</code>,
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
