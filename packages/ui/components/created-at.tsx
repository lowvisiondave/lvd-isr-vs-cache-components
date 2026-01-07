export function CreatedAt() {
	const timestamp = new Date().toISOString();

	return (
		<div className="px-4 py-3 rounded-lg bg-secondary/50 border">
			<p className="text-sm text-muted-foreground">
				Created at: <code className="font-mono text-foreground/80">{timestamp}</code>
			</p>
		</div>
	);
}
