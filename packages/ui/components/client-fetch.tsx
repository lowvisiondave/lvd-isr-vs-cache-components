"use client";

import { useEffect, useState } from "react";

export interface ClientFetchInnerProps {
	slug: string;
	delay?: number;
}

export function ClientFetchInner({ slug, delay = 1000 }: ClientFetchInnerProps) {
	const [data, setData] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await new Promise((resolve) => setTimeout(resolve, delay));
			setData(new Date().toISOString());
			setLoading(false);
		};

		fetchData();
	}, [delay]);

	return (
		<div className="mt-6 w-full max-w-sm">
			<div className="rounded-xl border bg-card p-5 shadow-sm">
				<p className="text-sm font-semibold mb-3">Client Fetch ({slug})</p>
				{loading ? (
					<div className="flex items-center gap-2 text-muted-foreground">
						<div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
						<span className="text-sm">Fetching fresh data...</span>
					</div>
				) : (
					<p className="text-sm text-muted-foreground">
						Fetched at:{" "}
						<code className="font-mono text-foreground/80">{data}</code>
					</p>
				)}
			</div>
		</div>
	);
}
