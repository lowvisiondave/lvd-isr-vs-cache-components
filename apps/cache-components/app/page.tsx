export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Cache Components</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Using Cache Components for component-level caching.
      </p>
      <p className="text-sm text-muted-foreground">
        Select a page from the sidebar to begin
      </p>
    </div>
  );
}
