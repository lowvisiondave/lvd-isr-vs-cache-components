export function Loading() {
	return (
		<div className="flex flex-col items-center justify-center h-32 gap-3">
			<div className="relative">
				<div className="h-8 w-8 rounded-full border-2 border-primary/20" />
				<div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
			</div>
			<span className="text-sm text-muted-foreground">Loading...</span>
		</div>
	);
}
